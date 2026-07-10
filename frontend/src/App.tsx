import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background3D from './components/Background3D';
import { ScannerForm } from './components/ScannerForm';
import { ResultsGrid } from './components/ResultsGrid';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { supabase } from './lib/supabase';
import { LogOut } from 'lucide-react';

interface Technology {
  name: string;
  categories: string[];
  versions?: string[];
}

interface ScanResponse {
  status: string;
  url: string;
  technologies: Technology[];
}

function App() {
  const [session, setSession] = useState<any>(null);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [view, setView] = useState<'scanner' | 'dashboard'>('scanner');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleScan = async (url: string) => {
    if (!session) return;
    
    setIsLoading(true);
    setError(null);
    setTechnologies([]);
    setHasScanned(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: ScanResponse = await response.json();
      setTechnologies(data.technologies);
    } catch (err: any) {
      setError(err.message || "Failed to analyze URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans">
      <Background3D />
      
      {session && (
        <nav className="absolute top-0 w-full z-20 p-6 flex justify-end gap-6 items-center">
          <button 
            onClick={() => setView('scanner')}
            className={`font-bold tracking-widest uppercase transition-colors ${view === 'scanner' ? 'text-[#00f3ff]' : 'text-white/50 hover:text-white'}`}
          >
            Scanner
          </button>
          <button 
            onClick={() => setView('dashboard')}
            className={`font-bold tracking-widest uppercase transition-colors ${view === 'dashboard' ? 'text-[#9d00ff]' : 'text-white/50 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="text-white/50 hover:text-red-400 transition-colors ml-4"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </nav>
      )}

      <main className="flex-1 flex flex-col items-center justify-start pt-24 px-6 pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#00f3ff] to-[#9d00ff] drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            DEEPSTACK SCANNER
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Uncover the technological foundation of any website.
          </p>
        </motion.div>

        {!session ? (
          <Auth />
        ) : view === 'dashboard' ? (
          <Dashboard />
        ) : (
          <>
            <ScannerForm onScan={handleScan} isLoading={isLoading} />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-8 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-3 rounded-lg backdrop-blur-md"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hasScanned && !isLoading && !error && technologies.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 text-white/50 text-xl font-light"
                >
                  No technologies detected.
                </motion.div>
              )}
            </AnimatePresence>

            <ResultsGrid technologies={technologies} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
