import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background3D from './components/Background3D';
import { ScannerForm } from './components/ScannerForm';
import { ResultsGrid } from './components/ResultsGrid';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { ToolsDashboard } from './components/ToolsDashboard';
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
  const [view, setView] = useState<'scanner' | 'dashboard' | 'auth' | 'tools'>('scanner');
  const [searchCount, setSearchCount] = useState(() => parseInt(localStorage.getItem('searchCount') || '0'));

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
    if (!session && searchCount >= 3) {
      setView('auth');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setTechnologies([]);
    setHasScanned(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: ScanResponse = await response.json();
      setTechnologies(data.technologies);
      
      if (!session) {
        const newCount = searchCount + 1;
        setSearchCount(newCount);
        localStorage.setItem('searchCount', newCount.toString());
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans">
      <Background3D />
      
      <nav className="absolute top-0 w-full z-20 p-6 flex justify-end gap-6 items-center">
        <button 
          onClick={() => setView('scanner')}
          className={`font-bold tracking-widest uppercase transition-colors ${view === 'scanner' ? 'text-[#00ff41] neon-text' : 'text-[#00ff41]/50 hover:text-[#00ff41]'}`}
        >
          Scanner
        </button>
        <button 
          onClick={() => setView('tools')}
          className={`font-bold tracking-widest uppercase transition-colors ${view === 'tools' ? 'text-[#00ff41] neon-text' : 'text-[#00ff41]/50 hover:text-[#00ff41]'}`}
        >
          Tools
        </button>
        {session ? (
          <>
            <button 
              onClick={() => setView('dashboard')}
              className={`font-bold tracking-widest uppercase transition-colors ${view === 'dashboard' ? 'text-[#00ff41] neon-text' : 'text-[#00ff41]/50 hover:text-[#00ff41]'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="text-[#00ff41]/50 hover:text-[#ff003c] transition-colors ml-4"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <button 
            onClick={() => setView('auth')}
            className={`font-bold tracking-widest uppercase transition-colors ${view === 'auth' ? 'text-[#00ff41] neon-text' : 'text-[#00ff41]/50 hover:text-[#00ff41]'}`}
          >
            Sign In
          </button>
        )}
      </nav>

      <main className="flex-1 flex flex-col items-center justify-start pt-24 px-6 pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center"
        >
          <h1 
            className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-[#00ff41] glitch-text"
            data-text="DEEPSTACK SCANNER"
          >
            DEEPSTACK SCANNER
          </h1>
          <p className="text-[#00ff41]/70 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            root@deepstack:~# ./uncover_tech_foundation.sh <span className="animate-pulse">_</span>
          </p>
        </motion.div>

        {!session && (view === 'auth' || searchCount >= 3) ? (
          <div className="flex flex-col items-center w-full max-w-md mx-auto">
            {searchCount >= 3 && view !== 'auth' && (
              <div className="mb-6 p-4 border border-[#ff003c] bg-[#ff003c]/10 rounded-none text-center w-full">
                <h2 className="text-xl text-[#ff003c] font-bold mb-2 neon-text-red">SYSTEM LOCKED</h2>
                <p className="text-[#ff003c]/80 text-sm">Trial expired. Authentication required to continue.</p>
              </div>
            )}
            <Auth />
          </div>
        ) : session && view === 'dashboard' ? (
          <Dashboard />
        ) : view === 'tools' ? (
          <ToolsDashboard session={session} />
        ) : (
          <>
            <ScannerForm onScan={handleScan} isLoading={isLoading} />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-8 bg-black/80 border border-[#ff003c] text-[#ff003c] px-6 py-3 rounded-none neon-text-red shadow-[0_0_10px_rgba(255,0,60,0.2)]"
                >
                  [ERROR] {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hasScanned && !isLoading && !error && technologies.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 text-[#00ff41]/50 text-xl"
                >
                  [NO_DATA_FOUND]
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
