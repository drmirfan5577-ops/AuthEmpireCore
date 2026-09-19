export interface ThemeConfig {
  glassIntensity: number;
  blurLevel: number;
  tintOpacity: number;
  neonGlow: number;
  colorTint: ColorTint;
  gradientPreset: GradientPreset;
  bgAnimation: BgAnimation;
}

export type ColorTint = 'blue' | 'purple' | 'pink' | 'orange' | 'green' | 'red';
export type GradientPreset = 'milky' | 'emerald' | 'crimson' | 'aurora' | 'universe' | 'glassy';
export type BgAnimation = 'particles' | 'stars' | 'bubbles' | 'waves' | 'rings' | 'none';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  verified: boolean;
  banned: boolean;
  suspended: boolean;
  createdAt: string;
  lastLogin: string;
  loginAttempts: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  sessionTimeout: number;
}

export interface Integration {
  id: string;
  name: string;
  type: 'resend' | 'cloudflare' | 'supabase' | 'firebase' | 'neon' | 'custom';
  status: 'active' | 'inactive' | 'error';
  apiKey?: string;
  config: Record<string, string>;
  createdAt: string;
}

export interface SidebarItem {
  icon: string;
  label: string;
  path: string;
  badge?: number;
}
