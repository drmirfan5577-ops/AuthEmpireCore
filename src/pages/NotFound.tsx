import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, Shield } from 'lucide-react';
import AnimatedBackground from '@/components/features/AnimatedBackground';
import GlassCard from '@/components/features/GlassCard';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    console.error('404: Non-existent route:', location.pathname);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { navigate('/'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-gradient, #020010)' }}>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <GlassCard neon className="p-10 text-center max-w-md w-full">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(187,134,252,0.2), rgba(74,108,247,0.2))', border: '1px solid rgba(187,134,252,0.3)' }}
          >
            <Shield size={36} style={{ color: 'var(--accent-color, #bb86fc)' }} />
          </div>
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <p className="text-white/60 text-base mb-2">Route not found in the Empire</p>
          <p className="text-white/30 text-xs mb-6 font-mono">{location.pathname}</p>
          <p className="text-white/30 text-sm mb-6">Redirecting in <span className="text-white/60 font-mono">{countdown}s</span>...</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm mx-auto transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, var(--neon-color, #4a6cf7), var(--accent-color, #bb86fc))' }}
          >
            <Home size={16} /> Return Home
          </button>
        </GlassCard>
      </div>
    </div>
  );
};

export default NotFound;
