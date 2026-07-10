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
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.05, rotateY: 10, rotateX: -5 }}
      className={cn(
        "glass-panel p-6 flex flex-col gap-3",
        "border-t border-l border-white/20",
        "hover:neon-border transition-all duration-300"
      )}
      style={{ perspective: 1000 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white tracking-wide">{name}</h3>
        {versions && versions.length > 0 && (
          <span className="text-xs bg-white/10 px-2 py-1 rounded text-[#00f3ff]">
            v{versions.join(', ')}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {categories.map((cat, i) => (
          <span 
            key={i} 
            className="text-[10px] uppercase tracking-wider bg-[#9d00ff]/20 text-[#c084fc] px-2 py-1 rounded-full border border-[#9d00ff]/30"
          >
            {cat}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
