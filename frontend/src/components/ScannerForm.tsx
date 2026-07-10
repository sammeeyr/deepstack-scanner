import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface ScannerFormProps {
  onScan: (url: string) => Promise<void>;
  isLoading: boolean;
}

export function ScannerForm({ onScan, isLoading }: ScannerFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onScan(url.trim());
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto mt-20 relative z-10"
    >
      <div className="relative group">
        {/* Glow effect behind the input */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#9d00ff] to-[#00f3ff] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative flex items-center glass-panel rounded-2xl p-2">
          <div className="pl-4 pr-2 text-[#00f3ff]">
            <Search size={24} className={cn("transition-all duration-300", isLoading && "animate-pulse")} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter target URL (e.g. example.com)"
            className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-lg px-2 py-3"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className={cn(
              "ml-2 px-6 py-3 rounded-xl font-semibold tracking-wide transition-all duration-300",
              "bg-white/10 hover:bg-white/20 text-[#00f3ff] border border-white/10",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center gap-2"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>SCANNING</span>
              </>
            ) : (
              <span>ANALYZE</span>
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
