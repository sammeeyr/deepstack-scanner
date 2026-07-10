import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2 } from 'lucide-react';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error: any) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto mt-20 glass-panel p-8"
    >
      <h2 className="text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-br from-[#00f3ff] to-[#9d00ff]">
        {isLogin ? 'ACCESS GRANTED' : 'INITIALIZE SYSTEM'}
      </h2>
      
      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-[#00f3ff]" size={20} />
          <input
            type="email"
            placeholder="Operator Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 outline-none focus:border-[#00f3ff] transition-colors"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-[#00f3ff]" size={20} />
          <input
            type="password"
            placeholder="Security Code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 outline-none focus:border-[#00f3ff] transition-colors"
            required
          />
        </div>

        {message && (
          <div className="text-sm text-center text-red-400 bg-red-500/10 p-2 rounded">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-3 rounded-lg font-bold tracking-widest bg-gradient-to-r from-[#9d00ff]/50 to-[#00f3ff]/50 hover:from-[#9d00ff]/80 hover:to-[#00f3ff]/80 border border-white/20 transition-all flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'AUTHENTICATE' : 'REGISTER')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          {isLogin ? "Don't have an access code? Register here." : "Already authorized? Authenticate here."}
        </button>
      </div>
    </motion.div>
  );
}
