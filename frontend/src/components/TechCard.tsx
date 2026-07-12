import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface TechCardProps {
  name: string;
  categories: string[];
  versions?: string[];
  index: number;
}

export function TechCard({ name, categories, versions, index }: TechCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.2, 
        delay: index * 0.05,
        ease: "linear"
      }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "hacker-panel p-6 flex flex-col gap-3 rounded-none relative overflow-hidden group",
        "border-t border-l border-[#00ff41]/50",
        "hover:neon-border transition-all duration-100"
      )}
    >
      <div className="absolute inset-0 bg-[#00ff41] opacity-0 group-hover:opacity-10 transition-opacity duration-100 pointer-events-none"></div>
      <div className="flex items-center justify-between z-10 relative">
        <h3 className="text-xl font-bold text-[#00ff41] tracking-wide">{name}</h3>
        {versions && versions.length > 0 && (
          <span className="text-xs bg-[#00ff41] px-2 py-1 rounded-none text-black font-bold">
            v{versions.join(', ')}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-auto z-10 relative">
        {categories.map((cat, i) => (
          <span 
            key={i} 
            className="text-[10px] uppercase tracking-wider bg-transparent text-[#00ff41]/80 px-2 py-1 rounded-none border border-[#00ff41]/50"
          >
            {cat}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
