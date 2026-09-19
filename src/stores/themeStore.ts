import { useState, useEffect, useCallback } from 'react';
import { ThemeConfig, ColorTint, GradientPreset, BgAnimation } from '@/types';
import { DEFAULT_THEME, GRADIENT_PRESETS, COLOR_TINTS } from '@/constants/themes';

const STORAGE_KEY = 'auth-empire-theme';

function loadTheme(): ThemeConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_THEME, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_THEME;
}

let globalTheme: ThemeConfig = loadTheme();
const listeners = new Set<() => void>();

function notifyAll() {
  listeners.forEach(fn => fn());
}

export function applyThemeToDom(theme: ThemeConfig) {
  const root = document.documentElement;
  const tint = COLOR_TINTS[theme.colorTint];
  const preset = GRADIENT_PRESETS[theme.gradientPreset];

  const glassAlpha = theme.glassIntensity / 100;
  const blurPx = Math.round((theme.blurLevel / 100) * 40);
  const tintAlpha = theme.tintOpacity / 100;
  const neonIntensity = theme.neonGlow / 100;

  root.style.setProperty('--glass-alpha', String(glassAlpha * 0.18));
  root.style.setProperty('--glass-blur', `${blurPx}px`);
  root.style.setProperty('--glass-border-alpha', String(glassAlpha * 0.25));
  root.style.setProperty('--tint-color', tint.hex);
  root.style.setProperty('--tint-alpha', String(tintAlpha * 0.25));
  root.style.setProperty('--neon-color', tint.hex);
  root.style.setProperty('--neon-spread', `${Math.round(neonIntensity * 30)}px`);
  root.style.setProperty('--neon-opacity', String(neonIntensity));
  root.style.setProperty('--accent-color', preset.textAccent);
  root.style.setProperty('--bg-gradient', preset.bg);

  // Update primary color token
  root.style.setProperty('--primary', tint.hsl);
}

export function useThemeStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const update = () => forceUpdate(n => n + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);

  const setTheme = useCallback((updates: Partial<ThemeConfig>) => {
    globalTheme = { ...globalTheme, ...updates };
    applyThemeToDom(globalTheme);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(globalTheme)); } catch {}
    notifyAll();
  }, []);

  return { theme: globalTheme, setTheme };
}

// Apply on load
applyThemeToDom(globalTheme);
