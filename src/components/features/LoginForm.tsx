import React, { useState } from 'react';
import { Eye, EyeOff, Fingerprint, Mail, Loader2, Shield, Smartphone, ArrowRight, Key, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import GlassCard from '@/components/features/GlassCard';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type Mode = 'password' | 'magic' | 'mfa';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#22c55e', '#00e676'];
  if (!password) return null;
  return (
    <div className="mt-1">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: i <= score ? colors[score] : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
      <p className="text-[11px] mt-1" style={{ color: colors[score] }}>{labels[score]}</p>
    </div>
  );
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithMagicLink, verifyMFA, auth } = useAuthStore();
  const [mode, setMode] = useState<Mode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields.'); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.mfaRequired) {
        setMode('mfa');
        toast.info('MFA required. Enter your 6-digit code.');
      } else {
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } else {
      toast.error(result.error || 'Login failed.');
    }
  };

  const handleMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await verifyMFA(mfaCode);
    setLoading(false);
    if (result.success) {
      toast.success('Identity verified. Welcome, Supreme Admin.');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Invalid code.');
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email address.'); return; }
    setLoading(true);
    const result = await loginWithMagicLink(email);
    setLoading(false);
    if (result.success) {
      setMagicSent(true);
      toast.success('Magic link sent! Check your inbox.');
    } else {
      toast.error(result.error || 'Failed to send magic link.');
    }
  };

  const handleBiometric = async () => {
    if (!window.PublicKeyCredential) {
      toast.error('WebAuthn not supported on this browser.');
      return;
    }
    setBiometricLoading(true);
    try {
      toast.info('Biometric authentication initiated. (Demo mode — simulating success)');
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Biometric verified! Logging in...');
      // In production: connect to WebAuthn flow
    } catch {
      toast.error('Biometric authentication failed.');
    }
    setBiometricLoading(false);
  };

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-white/40 focus:bg-white/15 transition-all";

  return (
    <GlassCard neon className="w-full max-w-sm p-6">
      {/* Logo */}
      <div className="text-center mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: 'linear-gradient(135deg, var(--neon-color, #4a6cf7)40, var(--neon-color, #4a6cf7)20)', border: '1px solid var(--neon-color, #4a6cf7)60' }}
        >
          <Shield size={26} style={{ color: 'var(--accent-color, #4a6cf7)' }} />
        </div>
        <h1 className="text-white font-bold text-xl">Auth Empire</h1>
        <p className="text-white/40 text-xs mt-0.5">Identity Provider · {mode === 'mfa' ? 'MFA Verification' : mode === 'magic' ? 'Magic Link' : 'Sign In'}</p>
      </div>

      {/* Mode Switcher */}
      {mode !== 'mfa' && (
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-5">
          {[
            { id: 'password', icon: <Key size={12} />, label: 'Password' },
            { id: 'magic',    icon: <Mail size={12} />, label: 'Magic Link' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as Mode)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                mode === m.id ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Password Form */}
      {mode === 'password' && (
        <form onSubmit={handlePasswordLogin} className="space-y-3">
          <input
            type="email" placeholder="Email address"
            value={email} onChange={e => setEmail(e.target.value)}
            className={inputClass} autoComplete="email"
          />
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'} placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              className={`${inputClass} pr-11`} autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <PasswordStrength password={password} />

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, var(--neon-color, #4a6cf7), var(--accent-color, #4a6cf7))' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><ArrowRight size={16} /> Sign In</>}
          </button>

          <div className="flex gap-2 mt-1">
            <button
              type="button" onClick={handleBiometric} disabled={biometricLoading}
              className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              {biometricLoading ? <Loader2 size={13} className="animate-spin" /> : <Fingerprint size={13} />}
              Biometric
            </button>
            <button
              type="button"
              className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-xs flex items-center justify-center gap-1.5 transition-all"
              onClick={() => toast.info('Social login — backend integration required.')}
            >
              <Smartphone size={13} /> Social
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/40 text-[11px] mb-1.5 font-medium">Demo Credentials</p>
            <div className="space-y-1">
              <button type="button" onClick={() => { setEmail('admin@authempire.io'); setPassword('Admin@1122'); }}
                className="w-full text-left text-[11px] text-white/50 hover:text-white/80 transition-colors">
                👑 admin@authempire.io / Admin@1122
              </button>
              <button type="button" onClick={() => { setEmail('user@demo.com'); setPassword('Demo@1234'); }}
                className="w-full text-left text-[11px] text-white/50 hover:text-white/80 transition-colors">
                👤 user@demo.com / Demo@1234
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Magic Link Form */}
      {mode === 'magic' && !magicSent && (
        <form onSubmit={handleMagicLink} className="space-y-3">
          <div className="p-3 rounded-xl bg-white/5 text-white/50 text-xs text-center">
            Enter your email and we will send you a passwordless login link.
          </div>
          <input
            type="email" placeholder="Email address"
            value={email} onChange={e => setEmail(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, var(--neon-color, #4a6cf7), var(--accent-color, #4a6cf7))' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Mail size={16} /> Send Magic Link</>}
          </button>
        </form>
      )}

      {mode === 'magic' && magicSent && (
        <div className="text-center py-4">
          <Mail size={36} className="mx-auto mb-3 opacity-60" style={{ color: 'var(--accent-color)' }} />
          <p className="text-white font-medium text-sm">Check your inbox</p>
          <p className="text-white/40 text-xs mt-1">Magic link sent to {email}</p>
          <button onClick={() => { setMagicSent(false); setEmail(''); }}
            className="mt-4 text-xs text-white/40 hover:text-white/70 flex items-center gap-1 mx-auto transition-colors">
            <RefreshCw size={11} /> Try different email
          </button>
        </div>
      )}

      {/* MFA Form */}
      {mode === 'mfa' && (
        <form onSubmit={handleMFA} className="space-y-4">
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
            <Smartphone size={28} className="mx-auto mb-2 opacity-70" style={{ color: 'var(--accent-color)' }} />
            <p className="text-white/80 text-sm font-medium">Two-Factor Authentication</p>
            <p className="text-white/40 text-xs mt-1">Enter the 6-digit code from your authenticator app. (Any 6 digits for demo)</p>
          </div>
          <input
            type="text" placeholder="000000" maxLength={6}
            value={mfaCode} onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
            className={`${inputClass} text-center tracking-[0.5em] text-lg font-mono`}
          />
          <button
            type="submit" disabled={loading || mfaCode.length !== 6}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--neon-color, #4a6cf7), var(--accent-color, #4a6cf7))' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Shield size={16} /> Verify Identity</>}
          </button>
          <button type="button" onClick={() => setMode('password')} className="w-full text-xs text-white/30 hover:text-white/60 transition-colors">
            ← Back to login
          </button>
        </form>
      )}
    </GlassCard>
  );
};

export default LoginForm;
