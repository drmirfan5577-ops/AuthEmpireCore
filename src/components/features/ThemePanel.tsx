import React, { useState } from 'react';
import { X, Sliders, Palette, Sparkles, Play } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import {
  GRADIENT_PRESETS, COLOR_TINTS, BG_ANIMATIONS, GradientPreset, ColorTint, BgAnimation
} from '@/constants/themes';
import GlassCard from '@/components/features/GlassCard';

interface ThemePanelProps {
  onClose: () => void;
}

const ThemePanel: React.FC<ThemePanelProps> = ({ onClose }) => {
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'sliders' | 'presets' | 'animation'>('presets');

  const sliders = [
    { key: 'glassIntensity', label: 'Glass Intensity', icon: '🪟', color: '#60a5fa' },
    { key: 'blurLevel',      label: 'Blur Level',      icon: '🌫️', color: '#a78bfa' },
    { key: 'tintOpacity',    label: 'Tint Opacity',    icon: '🎨', color: '#f472b6' },
    { key: 'neonGlow',       label: 'Neon Glow',       icon: '⚡', color: '#34d399' },
  ] as const;

  return (
    <div
      className="fixed right-0 top-0 h-full z-[200] flex items-stretch"
      style={{ width: '320px' }}
    >
      <GlassCard className="w-full h-full overflow-y-auto rounded-none rounded-l-2xl p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles size={18} style={{ color: 'var(--accent-color, #bb86fc)' }} />
            <span className="text-white font-semibold text-sm">Theme Designer</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'presets', icon: <Palette size={13} />, label: 'Presets' },
            { id: 'sliders', icon: <Sliders size={13} />, label: 'Filters' },
            { id: 'animation', icon: <Play size={13} />, label: 'Motion' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-white border-b-2'
                  : 'text-white/40 hover:text-white/70'
              }`}
              style={activeTab === tab.id ? { borderColor: 'var(--accent-color, #bb86fc)' } : {}}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {/* Presets Tab */}
          {activeTab === 'presets' && (
            <>
              <div>
                <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">Gradient Presets</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(GRADIENT_PRESETS) as GradientPreset[]).map(key => {
                    const p = GRADIENT_PRESETS[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setTheme({ gradientPreset: key })}
                        className={`relative rounded-xl p-0.5 transition-all ${
                          theme.gradientPreset === key ? 'ring-2' : 'ring-0 hover:ring-1 ring-white/20'
                        }`}
                        style={theme.gradientPreset === key ? { ringColor: p.textAccent } : {}}
                      >
                        <div
                          className="rounded-xl h-14 w-full flex items-end p-2"
                          style={{ background: p.bg }}
                        >
                          <span className="text-white text-xs font-medium drop-shadow">{p.label}</span>
                        </div>
                        {theme.gradientPreset === key && (
                          <div
                            className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                            style={{ background: p.textAccent }}
                          >✓</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">Color Tint</p>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(COLOR_TINTS) as ColorTint[]).map(key => (
                    <button
                      key={key}
                      onClick={() => setTheme({ colorTint: key })}
                      title={COLOR_TINTS[key].label}
                      className={`w-8 h-8 rounded-full transition-all ${
                        theme.colorTint === key ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent scale-110' : 'hover:scale-105'
                      }`}
                      style={{ background: COLOR_TINTS[key].hex }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Sliders Tab */}
          {activeTab === 'sliders' && (
            <div className="space-y-5">
              {sliders.map(slider => (
                <div key={slider.key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-xs">{slider.icon} {slider.label}</span>
                    <span className="text-white text-xs font-mono">{theme[slider.key]}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range" min={0} max={100}
                      value={theme[slider.key]}
                      onChange={e => setTheme({ [slider.key]: Number(e.target.value) } as any)}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${slider.color} 0%, ${slider.color} ${theme[slider.key]}%, rgba(255,255,255,0.1) ${theme[slider.key]}%, rgba(255,255,255,0.1) 100%)`,
                        accentColor: slider.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Animation Tab */}
          {activeTab === 'animation' && (
            <div>
              <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">Background Animation</p>
              <div className="space-y-2">
                {(Object.keys(BG_ANIMATIONS) as BgAnimation[]).map(key => (
                  <button
                    key={key}
                    onClick={() => setTheme({ bgAnimation: key })}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      theme.bgAnimation === key
                        ? 'bg-white/15 text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                    }`}
                  >
                    <span className="text-lg">
                      {key === 'particles' ? '✨' : key === 'stars' ? '⭐' : key === 'bubbles' ? '🫧' : key === 'waves' ? '🌊' : key === 'rings' ? '💫' : '⬛'}
                    </span>
                    <span className="text-sm font-medium">{BG_ANIMATIONS[key]}</span>
                    {theme.bgAnimation === key && (
                      <span className="ml-auto text-xs" style={{ color: 'var(--accent-color)' }}>Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default ThemePanel;
