import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { TechCard } from './TechCard';
import { Database, Clock, Link as LinkIcon } from 'lucide-react';

interface ScanHistory {
  id: string;
  url: string;
  technologies_json: any[];
  created_at: string;
}

export function Dashboard() {
  const [scans, setScans] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setScans(data || []);
    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-[#00f3ff] mt-20 animate-pulse">Loading Archive Data...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto mt-16"
    >
      <div className="flex items-center gap-3 mb-8">
        <Database className="text-[#9d00ff]" size={28} />
        <h2 className="text-3xl font-light tracking-widest text-white uppercase">
          Scan <span className="text-[#9d00ff] font-bold">Archive</span>
        </h2>
      </div>

      {scans.length === 0 ? (
        <div className="glass-panel p-12 text-center text-white/50 font-light">
          No records found in the archive. Initiate a scan to populate data.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {scans.map((scan) => (
            <motion.div 
              key={scan.id}
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="glass-panel p-6 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xl font-bold text-[#00f3ff]">
                  <LinkIcon size={20} />
                  {scan.url}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Clock size={14} />
                  {new Date(scan.created_at).toLocaleString()}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {scan.technologies_json.map((tech: any, i: number) => (
                  <TechCard 
                    key={i} 
                    index={i} 
                    name={tech.name} 
                    categories={tech.categories} 
                    versions={tech.versions} 
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
