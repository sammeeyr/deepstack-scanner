import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background3D from './components/Background3D';
import { ScannerForm } from './components/ScannerForm';
import { ResultsGrid } from './components/ResultsGrid';

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
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);

  const handleScan = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setTechnologies([]);
    setHasScanned(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
            Uncover the technological foundation of any website. Enter a URL to initiate a deep scan.
          </p>
        </motion.div>

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
      </main>
    </div>
  );
}

export default App;
