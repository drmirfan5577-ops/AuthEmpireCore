import React from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  neon?: boolean;
  onClick?: () => void;
  as?: 'div' | 'section' | 'article' | 'aside';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children, className, neon = false, onClick, as: Tag = 'div'
}) => {
  const { theme } = useThemeStore();

  const glassStyle: React.CSSProperties = {
    background: `rgba(255,255,255,${theme.glassIntensity / 100 * 0.12})`,
    backdropFilter: `blur(${Math.round(theme.blurLevel / 100 * 32)}px)`,
    WebkitBackdropFilter: `blur(${Math.round(theme.blurLevel / 100 * 32)}px)`,
    border: `1px solid rgba(255,255,255,${theme.glassIntensity / 100 * 0.2})`,
    boxShadow: neon
      ? `0 0 ${Math.round(theme.neonGlow / 100 * 30)}px var(--neon-color, #4a6cf7)${Math.round(theme.neonGlow / 100 * 60).toString(16).padStart(2,'0')}, inset 0 1px 0 rgba(255,255,255,0.15)`
      : 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 32px rgba(0,0,0,0.3)',
  };

  return (
    <Tag
      className={cn('rounded-2xl transition-all duration-300', className)}
      style={glassStyle}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};

export default GlassCard;
