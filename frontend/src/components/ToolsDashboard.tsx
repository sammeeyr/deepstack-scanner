import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToolsDashboardProps {
  session: any;
}

export function ToolsDashboard({ session }: ToolsDashboardProps) {
  const [activeTool, setActiveTool] = useState<'ipcheck' | 'portscan' | 'dns' | 'aidetect'>('ipcheck');
  const [target, setTarget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleExecute = async () => {
    if (!target) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/tools/${activeTool}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ target }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to execute tool");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex justify-center gap-4 border-b border-[#00ff41]/30 pb-4">
        <button
          onClick={() => { setActiveTool('ipcheck'); setResult(null); setError(null); }}
          className={`px-4 py-2 font-bold tracking-widest uppercase transition-colors ${activeTool === 'ipcheck' ? 'text-[#00ff41] border-b-2 border-[#00ff41]' : 'text-[#00ff41]/50 hover:text-[#00ff41]'}`}
        >
          IP Checker
        </button>
        <button
          onClick={() => { setActiveTool('portscan'); setResult(null); setError(null); }}
          className={`px-4 py-2 font-bold tracking-widest uppercase transition-colors ${activeTool === 'portscan' ? 'text-[#00ff41] border-b-2 border-[#00ff41]' : 'text-[#00ff41]/50 hover:text-[#00ff41]'}`}
        >
          Port Scanner
        </button>
        <button
          onClick={() => { setActiveTool('dns'); setResult(null); setError(null); }}
          className={`px-4 py-2 font-bold tracking-widest uppercase transition-colors ${activeTool === 'dns' ? 'text-[#00ff41] border-b-2 border-[#00ff41]' : 'text-[#00ff41]/50 hover:text-[#00ff41]'}`}
        >
          DNS Lookup
        </button>
        <button
          onClick={() => { setActiveTool('aidetect'); setResult(null); setError(null); }}
          className={`px-4 py-2 font-bold tracking-widest uppercase transition-colors ${activeTool === 'aidetect' ? 'text-[#00ff41] border-b-2 border-[#00ff41]' : 'text-[#00ff41]/50 hover:text-[#00ff41]'}`}
        >
          AI Detector
        </button>
      </div>

      <div className="bg-black/80 border border-[#00ff41]/30 p-6 shadow-[0_0_15px_rgba(0,255,65,0.1)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-50"></div>
        
        <h2 className="text-2xl font-bold mb-4 text-[#00ff41] uppercase tracking-wider">
          {activeTool === 'ipcheck' ? 'IP Address Resolution' : activeTool === 'portscan' ? 'Common Port Scanner' : activeTool === 'aidetect' ? 'AI Website Detector' : 'DNS Record Lookup'}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter domain or IP (e.g., example.com)"
            className="flex-1 bg-black/50 border border-[#00ff41]/50 text-[#00ff41] px-4 py-3 focus:outline-none focus:border-[#00ff41] focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all font-mono placeholder-[#00ff41]/30"
          />
          <button
            onClick={handleExecute}
            disabled={isLoading || !target}
            className="bg-[#00ff41]/10 border border-[#00ff41] text-[#00ff41] px-8 py-3 font-bold tracking-widest uppercase hover:bg-[#00ff41]/20 hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Executing...' : 'Execute'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[#ff003c] border border-[#ff003c]/50 p-4 mb-4 bg-[#ff003c]/10"
            >
              [ERROR] {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-[#00ff41]/30 p-4 bg-black/50 font-mono text-sm overflow-x-auto w-full"
            >
              {activeTool === 'aidetect' ? (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#00ff41]/10 border border-[#00ff41]/30 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff41]/50"></div>
                      <span className="text-[#00ff41]/70 uppercase text-xs tracking-widest mb-2">Detection Status</span>
                      <span className={`text-2xl font-bold ${result.is_ai_generated ? 'text-[#ff003c] drop-shadow-[0_0_8px_rgba(255,0,60,0.8)]' : 'text-[#00ff41]'}`}>
                        {result.is_ai_generated ? 'AI DETECTED' : 'HUMAN WRITTEN'}
                      </span>
                    </div>
                    <div className="bg-[#00ff41]/10 border border-[#00ff41]/30 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff41]/50"></div>
                      <span className="text-[#00ff41]/70 uppercase text-xs tracking-widest mb-2">Confidence Score</span>
                      <span className="text-2xl font-bold text-[#00ff41]">{result.confidence || "0%"}</span>
                    </div>
                  </div>
                  
                  {result.tools_detected && result.tools_detected.length > 0 && (
                    <div className="mt-2">
                      <h3 className="text-[#00ff41] font-bold uppercase tracking-wider mb-4 border-b border-[#00ff41]/30 pb-2">Identified Signatures</h3>
                      <div className="flex flex-wrap gap-4">
                        {result.tools_detected.map((tool: string, idx: number) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-black/80 border border-[#00ff41] w-48 p-4 flex flex-col gap-2 shadow-[0_0_10px_rgba(0,255,65,0.2)] hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-shadow cursor-default relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff41]"></div>
                            <span className="text-[#00ff41]/50 text-xs font-bold uppercase ml-2">Generator Tool</span>
                            <span className="text-[#00ff41] font-bold text-lg ml-2 truncate" title={tool}>{tool}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.is_ai_generated && (!result.tools_detected || result.tools_detected.length === 0) && (
                     <div className="text-[#00ff41]/70 text-center uppercase tracking-widest text-sm mt-4">
                        AI signatures detected but specific generator tool could not be identified.
                     </div>
                  )}
                </div>
              ) : (
                <pre className="text-[#00ff41]">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
