import React, { useState } from 'react';
import AnimatedBackground from '@/components/features/AnimatedBackground';
import LoginForm from '@/components/features/LoginForm';
import ThemePanel from '@/components/features/ThemePanel';
import Header from '@/components/layout/Header';
import StarSidebar from '@/components/layout/StarSidebar';
import FAB from '@/components/layout/FAB';
import GlassCard from '@/components/features/GlassCard';
import { Shield, Zap, Lock, Globe, Fingerprint, Key } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const FEATURES = [
  { icon: <Fingerprint size={20} />, label: 'Biometric Auth',    desc: 'WebAuthn fingerprint login' },
  { icon: <Shield size={20} />,      label: 'MFA / TOTP',        desc: 'Google Authenticator 2FA' },
  { icon: <Lock size={20} />,        label: 'Zero Trust',        desc: 'JWT rotation + session guard' },
  { icon: <Globe size={20} />,       label: 'Social Login',      desc: 'Google, GitHub, Apple' },
  { icon: <Key size={20} />,         label: 'Magic Link',        desc: 'Passwordless email auth' },
  { icon: <Zap size={20} />,         label: 'SDK Ready',         desc: 'Embed in any app via import' },
];

const Index: React.FC = () => {
  const [themeOpen, setThemeOpen] = useState(false);
  const { theme } = useThemeStore();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-gradient)' }}>
      <AnimatedBackground />

      {/* Header */}
      <Header onThemeToggle={() => setThemeOpen(prev => !prev)} />

      {/* Star Sidebars */}
      <StarSidebar side="left" />
      <StarSidebar side="right" />

      {/* FAB */}
      <FAB onThemeToggle={() => setThemeOpen(prev => !prev)} />

      {/* Theme Panel */}
      {themeOpen && <ThemePanel onClose={() => setThemeOpen(false)} />}

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-10">

          {/* Left: Branding + Features */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/60 text-xs">Enterprise Identity Provider v1.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Auth<span style={{ color: 'var(--accent-color, #bb86fc)' }}>Empire</span>
              <br />
              <span className="text-white/60 text-2xl sm:text-3xl font-normal">Core Identity Hub</span>
            </h1>

            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              A unified, glassmorphic Identity Provider with biometric auth, dynamic themes, 
              and a god-mode admin panel. One identity to rule them all.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FEATURES.map((f, i) => (
                <GlassCard key={i} className="flex items-center gap-2 px-3 py-2.5 cursor-default hover:bg-white/10 transition-all group">
                  <span style={{ color: 'var(--accent-color, #bb86fc)' }} className="group-hover:scale-110 transition-transform shrink-0">
                    {f.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-medium truncate">{f.label}</p>
                    <p className="text-white/30 text-[10px] truncate">{f.desc}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Right: Login form */}
          <div className="flex-shrink-0 w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
