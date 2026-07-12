import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
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
        <div className="relative flex items-center hacker-panel p-2">
          <div className="pl-4 pr-2 text-[#00ff41] font-bold text-xl flex items-center gap-2">
            <span>root@deepstack:~#</span>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="target_ip_or_url"
            className="w-full bg-transparent border-none outline-none text-[#00ff41] placeholder-[#00ff41]/30 text-lg px-2 py-3"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className={cn(
              "ml-2 px-6 py-3 font-bold tracking-widest uppercase transition-all duration-300",
              "bg-transparent text-[#00ff41] border border-[#00ff41] hover:bg-[#00ff41] hover:text-black",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center gap-2 neon-border"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>[EXECUTING]</span>
              </>
            ) : (
              <span>[INITIATE]</span>
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
