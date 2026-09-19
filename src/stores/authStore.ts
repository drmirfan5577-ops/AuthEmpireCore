import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '@/types';

const STORAGE_KEY = 'auth-empire-session';
const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: 'admin-001',
    email: 'admin@authempire.io',
    name: 'Supreme Admin',
    role: 'admin',
    verified: true,
    banned: false,
    suspended: false,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    loginAttempts: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: 'user-001',
    email: 'user@demo.com',
    name: 'Demo User',
    role: 'user',
    verified: true,
    banned: false,
    suspended: false,
    createdAt: '2024-06-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    loginAttempts: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  },
];

const CREDENTIALS: Record<string, string> = {
  'admin@authempire.io': 'Admin@1122',
  'user@demo.com': 'Demo@1234',
};

let globalAuth: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  mfaRequired: false,
  sessionTimeout: 0,
};

// Restore session
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.expiry && Date.now() < parsed.expiry) {
      globalAuth = {
        user: parsed.user,
        isAuthenticated: true,
        isLoading: false,
        mfaRequired: false,
        sessionTimeout: parsed.expiry,
      };
    }
  }
} catch {}

const listeners = new Set<() => void>();
const failedAttempts: Record<string, number> = {};
const lockedUntil: Record<string, number> = {};

function notifyAll() {
  listeners.forEach(fn => fn());
}

export function useAuthStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const update = () => forceUpdate(n => n + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string; mfaRequired?: boolean }> => {
    const now = Date.now();
    if (lockedUntil[email] && now < lockedUntil[email]) {
      const mins = Math.ceil((lockedUntil[email] - now) / 60000);
      return { success: false, error: `Account locked. Try again in ${mins} minute(s).` };
    }

    const user = MOCK_USERS.find(u => u.email === email);
    const correctPw = CREDENTIALS[email];

    if (!user || password !== correctPw) {
      failedAttempts[email] = (failedAttempts[email] || 0) + 1;
      if (failedAttempts[email] >= 5) {
        lockedUntil[email] = now + 15 * 60000;
        failedAttempts[email] = 0;
        return { success: false, error: 'Too many failed attempts. Account locked for 15 minutes.' };
      }
      return { success: false, error: `Invalid credentials. ${5 - failedAttempts[email]} attempts remaining.` };
    }

    if (user.banned) return { success: false, error: 'Account banned. Contact support.' };
    if (user.suspended) return { success: false, error: 'Account suspended. Contact support.' };

    failedAttempts[email] = 0;

    // Simulate MFA for admin
    if (user.role === 'admin') {
      globalAuth = { ...globalAuth, mfaRequired: true };
      notifyAll();
      return { success: true, mfaRequired: true };
    }

    completeLogin(user);
    return { success: true };
  }, []);

  const verifyMFA = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    // Mock TOTP - accept "123456" or any 6-digit code for demo
    if (!/^\d{6}$/.test(code)) {
      return { success: false, error: 'Invalid code format.' };
    }
    const user = MOCK_USERS.find(u => u.role === 'admin')!;
    completeLogin(user);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    globalAuth = { user: null, isAuthenticated: false, isLoading: false, mfaRequired: false, sessionTimeout: 0 };
    localStorage.removeItem(STORAGE_KEY);
    notifyAll();
  }, []);

  const loginWithMagicLink = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) return { success: false, error: 'No account found with that email.' };
    return { success: true };
  }, []);

  const getAllUsers = useCallback(() => MOCK_USERS, []);
  const banUser = useCallback((userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) { user.banned = !user.banned; notifyAll(); }
  }, []);
  const suspendUser = useCallback((userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) { user.suspended = !user.suspended; notifyAll(); }
  }, []);

  return {
    auth: globalAuth,
    login,
    verifyMFA,
    logout,
    loginWithMagicLink,
    getAllUsers,
    banUser,
    suspendUser,
  };
}

function completeLogin(user: User) {
  const expiry = Date.now() + SESSION_TIMEOUT_MS;
  globalAuth = {
    user: { ...user, lastLogin: new Date().toISOString() },
    isAuthenticated: true,
    isLoading: false,
    mfaRequired: false,
    sessionTimeout: expiry,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: globalAuth.user, expiry }));
  } catch {}
  notifyAll();
}
