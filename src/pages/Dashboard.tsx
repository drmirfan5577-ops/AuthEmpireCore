import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, LogOut, Settings, Bell, Activity, Users, Key,
  CheckCircle, Clock, BarChart3, Cpu, Globe, Lock, Zap
} from 'lucide-react';
import AnimatedBackground from '@/components/features/AnimatedBackground';
import GlassCard from '@/components/features/GlassCard';
import Header from '@/components/layout/Header';
import StarSidebar from '@/components/layout/StarSidebar';
import FAB from '@/components/layout/FAB';
import ThemePanel from '@/components/features/ThemePanel';
import AdminPanel from '@/components/features/AdminPanel';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface StatCard { label: string; value: string; delta?: string; color: string; icon: React.ReactNode }
interface ActivityItem { time: string; action: string; status: 'success' | 'warning' | 'error' }

const STATS: StatCard[] = [
  { label: 'Active Sessions',  value: '1',     delta: '+1',   color: '#60a5fa', icon: <Activity size={16} /> },
  { label: 'Auth Events Today', value: '3',    delta: '+3',   color: '#34d399', icon: <CheckCircle size={16} /> },
  { label: 'Security Score',   value: '94%',  delta: '+2%',  color: '#a78bfa', icon: <Shield size={16} /> },
  { label: 'Response Time',    value: '12ms',  delta: '-4ms', color: '#fb923c', icon: <Zap size={16} /> },
];

const ACTIVITY_LOG: ActivityItem[] = [
  { time: 'Just now',   action: 'Successful login via password',   status: 'success' },
  { time: '2 min ago',  action: 'MFA code verified',               status: 'success' },
  { time: '15 min ago', action: 'Session renewed (JWT rotation)',   status: 'success' },
  { time: '1 hr ago',   action: 'Failed login attempt blocked',     status: 'warning' },
  { time: '3 hr ago',   action: 'Device fingerprint registered',    status: 'success' },
  { time: '1 day ago',  action: 'Password strength check passed',   status: 'success' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuthStore();
  const [themeOpen, setThemeOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [sessionTime, setSessionTime] = useState(900); // 15 mins in seconds

  useEffect(() => {
    if (!auth.isAuthenticated) { navigate('/'); return; }
  }, [auth.isAuthenticated, navigate]);

  // Session countdown
  useEffect(() => {
    if (!auth.isAuthenticated) return;
    const interval = setInterval(() => {
      setSessionTime(prev => {
        if (prev <= 1) {
          toast.warning('Session expired. Please log in again.');
          logout();
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated]);

  const mins = Math.floor(sessionTime / 60);
  const secs = sessionTime % 60;

  if (!auth.user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-gradient)' }}>
      <AnimatedBackground />

      <Header
        onThemeToggle={() => setThemeOpen(p => !p)}
        onAdminToggle={() => setAdminOpen(p => !p)}
        showAdmin={auth.user.role === 'admin'}
      />
      <StarSidebar side="left" />
      <StarSidebar side="right" />
      <FAB onThemeToggle={() => setThemeOpen(p => !p)} />

      {themeOpen && <ThemePanel onClose={() => setThemeOpen(false)} />}
      {adminOpen && auth.user.role === 'admin' && <AdminPanel onClose={() => setAdminOpen(false)} />}

      <div className="relative z-10 pt-[110px] pb-20 px-4">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Welcome bar */}
          <GlassCard neon className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={auth.user.avatar}
                alt={auth.user.name}
                className="w-10 h-10 rounded-full border-2"
                style={{ borderColor: 'var(--accent-color, #4a6cf7)' }}
              />
              <div>
                <h2 className="text-white font-bold text-base">
                  Welcome back, {auth.user.name}
                  {auth.user.role === 'admin' && <span className="ml-2 text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">ADMIN</span>}
                </h2>
                <p className="text-white/40 text-xs">{auth.user.email} · Last login: {new Date(auth.user.lastLogin).toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Session timer */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <Clock size={12} className="text-yellow-400" />
                <span className="text-white/60 text-xs font-mono">
                  {mins}:{secs.toString().padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); toast.success('Signed out.'); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 hover:border-red-500/40 hover:bg-red-500/10 text-white/60 hover:text-red-300 transition-all text-xs"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </GlassCard>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STATS.map((stat, i) => (
              <GlassCard key={i} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                  {stat.delta && (
                    <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">{stat.delta}</span>
                  )}
                </div>
                <p className="text-white font-bold text-xl" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
              </GlassCard>
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Activity log */}
            <GlassCard className="lg:col-span-2 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={16} style={{ color: 'var(--accent-color)' }} />
                <h3 className="text-white font-semibold text-sm">Auth Activity Log</h3>
              </div>
              <div className="space-y-2">
                {ACTIVITY_LOG.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      item.status === 'success' ? 'bg-green-400' :
                      item.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <span className="text-white/70 text-xs flex-1">{item.action}</span>
                    <span className="text-white/30 text-[11px] shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Security panel */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} style={{ color: 'var(--accent-color)' }} />
                <h3 className="text-white font-semibold text-sm">Security Status</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'JWT Token',         ok: true },
                  { label: 'MFA Enabled',       ok: auth.user.role === 'admin' },
                  { label: 'Session Active',    ok: true },
                  { label: 'Device Verified',   ok: true },
                  { label: 'Brute Force Guard', ok: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">{item.label}</span>
                    <div className={`flex items-center gap-1 text-[11px] ${item.ok ? 'text-green-400' : 'text-yellow-400'}`}>
                      {item.ok ? <CheckCircle size={11} /> : <Clock size={11} />}
                      {item.ok ? 'OK' : 'Setup'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Score ring */}
              <div className="mt-4 flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(var(--accent-color, #bb86fc) 0% 94%, rgba(255,255,255,0.05) 94% 100%)`,
                    padding: '3px',
                  }}
                >
                  <div className="w-full h-full rounded-full bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">94%</span>
                  </div>
                </div>
                <p className="text-white/40 text-xs mt-2">Security Score</p>
              </div>
            </GlassCard>
          </div>

          {/* SDK Export info */}
          <GlassCard className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Cpu size={18} style={{ color: 'var(--accent-color)' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm mb-1">SDK / Widget Integration</h3>
                <p className="text-white/40 text-xs leading-relaxed">
                  Auth Empire Core is structured for embedding. Import the <code className="text-white/60 bg-white/10 px-1 rounded">LoginForm</code>, <code className="text-white/60 bg-white/10 px-1 rounded">useAuthStore</code>, and <code className="text-white/60 bg-white/10 px-1 rounded">GlassCard</code> components into any future app (IQMail, ESOneWorld) for instant enterprise auth.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {['IQMail', 'ESOneWorld'].map(app => (
                  <span key={app} className="text-[10px] px-2 py-1 rounded-lg bg-white/10 text-white/50 border border-white/10">
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
