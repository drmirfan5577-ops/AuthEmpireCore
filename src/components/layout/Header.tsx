import React, { useEffect, useRef, useState } from 'react';
import { useClock } from '@/hooks/useClock';
import { MOTIVATIONAL_QUOTES, MARKETING_CTAS } from '@/constants/quotes';
import GlassCard from '@/components/features/GlassCard';

const MarqueeStrip: React.FC<{ items: string[]; speed?: number; reverse?: boolean; className?: string }> = ({
  items, speed = 40, reverse = false, className = ''
}) => {
  const content = [...items, ...items];
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-flex gap-8"
        style={{
          animation: `marquee${reverse ? 'Reverse' : ''} ${speed}s linear infinite`,
        }}
      >
        {content.map((item, i) => (
          <span key={i} className="text-[11px] opacity-60 shrink-0">
            <span className="mr-4" style={{ color: 'var(--accent-color, #4a6cf7)' }}>◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

interface HeaderProps {
  onThemeToggle: () => void;
  onAdminToggle?: () => void;
  showAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onThemeToggle, onAdminToggle, showAdmin = false }) => {
  const clock = useClock();

  return (
    <>
      {/* Top Marquee Strips */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none select-none">
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/5 py-1">
          <MarqueeStrip items={MOTIVATIONAL_QUOTES} speed={50} className="text-white/60" />
        </div>
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/5 py-1">
          <MarqueeStrip items={MARKETING_CTAS} speed={35} reverse className="text-white/80" />
        </div>
      </div>

      {/* Main Header */}
      <div className="fixed top-[46px] left-0 right-0 z-50">
        <GlassCard className="rounded-none px-4 py-2 flex items-center justify-between" as="aside">
          {/* Left: Bismillah */}
          <div className="flex items-center gap-3">
            <span
              className="font-medium text-sm hidden sm:block"
              style={{ color: 'var(--accent-color, #bb86fc)', fontFamily: 'Georgia, serif', opacity: 0.9 }}
            >
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </span>
            <span className="text-white/20 hidden sm:block">|</span>
            <span className="text-white font-bold text-sm tracking-wide">Auth<span style={{ color: 'var(--accent-color)' }}>Empire</span></span>
          </div>

          {/* Right: Clocks */}
          <div className="flex items-center gap-3">
            {/* Dual Clock */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-mono text-xs">{clock.gregorian}</p>
                <p className="text-white/40 text-[10px]">{clock.gregorianDate}</p>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="text-right">
                <p className="font-mono text-xs" style={{ color: 'var(--accent-color, #bb86fc)' }}>{clock.hijri}</p>
                <p className="text-white/30 text-[10px]">Hijri Calendar</p>
              </div>
            </div>

            {/* Mobile clock */}
            <div className="md:hidden">
              <p className="text-white font-mono text-xs">{clock.gregorian}</p>
            </div>

            {/* Theme button */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs font-medium"
              title="Open Theme Designer"
            >
              🎨
            </button>

            {showAdmin && onAdminToggle && (
              <button
                onClick={onAdminToggle}
                className="p-2 rounded-xl border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-400/60 hover:text-red-300 transition-all text-xs"
                title="Admin Panel"
              >
                👑
              </button>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Marquee animation styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default Header;
