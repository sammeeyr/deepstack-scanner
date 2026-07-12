import { TechCard } from './TechCard';
import { motion } from 'framer-motion';

interface Technology {
  name: string;
  categories: string[];
  versions?: string[];
}

interface ResultsGridProps {
  technologies: Technology[];
}

export function ResultsGrid({ technologies }: ResultsGridProps) {
  if (!technologies || technologies.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-12 w-full max-w-6xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#00ff41]/50 to-transparent"></div>
        <h2 className="text-2xl font-bold tracking-widest text-[#00ff41] neon-text uppercase">
          [EXTRACTED_NODES]
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#00ff41]/50 to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {technologies.map((tech, index) => (
          <TechCard 
            key={tech.name} 
            index={index}
            name={tech.name}
            categories={tech.categories}
            versions={tech.versions}
          />
        ))}
      </div>
    </motion.div>
  );
}
