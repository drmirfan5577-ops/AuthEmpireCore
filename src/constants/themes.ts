import { GradientPreset, ColorTint, BgAnimation, ThemeConfig } from '@/types';

export const GRADIENT_PRESETS: Record<GradientPreset, {
  label: string;
  bg: string;
  from: string;
  via: string;
  to: string;
  textAccent: string;
  glow: string;
}> = {
  milky: {
    label: 'Milky White',
    bg: 'linear-gradient(135deg, #f8faff 0%, #e8f4fd 30%, #f0e8ff 60%, #fef9ff 100%)',
    from: '#e8f4fd',
    via: '#f0e8ff',
    to: '#fef9ff',
    textAccent: '#4a6cf7',
    glow: '0 0 20px rgba(74,108,247,0.4)',
  },
  emerald: {
    label: 'Emerald',
    bg: 'linear-gradient(135deg, #0a1a14 0%, #0d2b1f 30%, #143d2a 60%, #0a2018 100%)',
    from: '#0d2b1f',
    via: '#143d2a',
    to: '#1a5438',
    textAccent: '#00e676',
    glow: '0 0 20px rgba(0,230,118,0.5)',
  },
  crimson: {
    label: 'Crimson',
    bg: 'linear-gradient(135deg, #1a0510 0%, #2d0a18 30%, #3d0f20 60%, #1a0810 100%)',
    from: '#2d0a18',
    via: '#3d0f20',
    to: '#5c1528',
    textAccent: '#ff4081',
    glow: '0 0 20px rgba(255,64,129,0.5)',
  },
  aurora: {
    label: 'Aurora',
    bg: 'linear-gradient(135deg, #020818 0%, #0a1628 30%, #061220 60%, #0d1a30 100%)',
    from: '#0a1628',
    via: '#102035',
    to: '#1a0d3a',
    textAccent: '#00e5ff',
    glow: '0 0 25px rgba(0,229,255,0.5)',
  },
  universe: {
    label: 'Universe',
    bg: 'linear-gradient(135deg, #020010 0%, #0c0520 30%, #08031a 60%, #050215 100%)',
    from: '#0c0520',
    via: '#0e061f',
    to: '#160830',
    textAccent: '#bb86fc',
    glow: '0 0 25px rgba(187,134,252,0.5)',
  },
  glassy: {
    label: 'Glassy',
    bg: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(100,120,255,0.08) 50%, rgba(150,80,255,0.05) 100%)',
    from: 'rgba(255,255,255,0.05)',
    via: 'rgba(100,120,255,0.08)',
    to: 'rgba(150,80,255,0.05)',
    textAccent: '#a0b4ff',
    glow: '0 0 20px rgba(160,180,255,0.4)',
  },
};

export const COLOR_TINTS: Record<ColorTint, { label: string; hex: string; hsl: string }> = {
  blue:   { label: 'Blue',   hex: '#4a6cf7', hsl: '230 91% 63%' },
  purple: { label: 'Purple', hex: '#9b59b6', hsl: '283 40% 53%' },
  pink:   { label: 'Pink',   hex: '#e91e8c', hsl: '328 80% 51%' },
  orange: { label: 'Orange', hex: '#ff7043', hsl: '14 100% 63%' },
  green:  { label: 'Green',  hex: '#00e676', hsl: '151 100% 45%' },
  red:    { label: 'Red',    hex: '#f44336', hsl: '4 90% 58%' },
};

export const BG_ANIMATIONS: Record<BgAnimation, string> = {
  particles: 'Particles',
  stars:     'Stars',
  bubbles:   'Bubbles',
  waves:     'Fluid Waves',
  rings:     'Rings',
  none:      'None',
};

export const DEFAULT_THEME: ThemeConfig = {
  glassIntensity: 65,
  blurLevel: 55,
  tintOpacity: 30,
  neonGlow: 70,
  colorTint: 'blue',
  gradientPreset: 'universe',
  bgAnimation: 'stars',
};
