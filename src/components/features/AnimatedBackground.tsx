import React, { useRef, useEffect, useCallback } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { GRADIENT_PRESETS } from '@/constants/themes';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; color: string; life: number;
}

interface Star { x: number; y: number; r: number; alpha: number; twinkleSpeed: number; }
interface Bubble { x: number; y: number; r: number; vx: number; vy: number; alpha: number; }
interface Ring { x: number; y: number; r: number; maxR: number; alpha: number; speed: number; color: string; }

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const { theme } = useThemeStore();
  const preset = GRADIENT_PRESETS[theme.gradientPreset];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    let animFrame: number;
    let stars: Star[] = [];
    let particles: Particle[] = [];
    let bubbles: Bubble[] = [];
    let rings: Ring[] = [];
    let waveOffset = 0;
    let tick = 0;

    const accent = preset.textAccent;
    const tint = accent;

    // Init stars
    if (theme.bgAnimation === 'stars') {
      for (let i = 0; i < 220; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.8 + 0.3,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    }

    // Init particles
    if (theme.bgAnimation === 'particles') {
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          color: accent, life: Math.random(),
        });
      }
    }

    // Init bubbles
    if (theme.bgAnimation === 'bubbles') {
      for (let i = 0; i < 25; i++) {
        bubbles.push({
          x: Math.random() * W, y: H + Math.random() * 200,
          r: Math.random() * 30 + 8,
          vx: (Math.random() - 0.5) * 0.6, vy: -(Math.random() * 1.2 + 0.4),
          alpha: Math.random() * 0.15 + 0.05,
        });
      }
    }

    // Init rings
    if (theme.bgAnimation === 'rings') {
      for (let i = 0; i < 6; i++) {
        rings.push({
          x: Math.random() * W, y: Math.random() * H,
          r: 0, maxR: Math.random() * 200 + 100,
          alpha: 0.6, speed: Math.random() * 0.8 + 0.3,
          color: accent,
        });
      }
    }

    function render() {
      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, preset.from);
      grad.addColorStop(0.5, preset.via);
      grad.addColorStop(1, preset.to);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      tick++;

      if (theme.bgAnimation === 'stars') {
        stars.forEach(s => {
          s.alpha += Math.sin(tick * s.twinkleSpeed) * 0.015;
          s.alpha = Math.max(0.1, Math.min(1, s.alpha));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
          ctx.fill();
        });
        // Shooting star occasionally
        if (tick % 180 === 0) {
          const sx = Math.random() * W * 0.7;
          const sy = Math.random() * H * 0.4;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + 100, sy + 30);
          ctx.strokeStyle = `rgba(255,255,255,0.7)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      if (theme.bgAnimation === 'particles') {
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.round(p.opacity * 255).toString(16).padStart(2,'0')}`;
          ctx.fill();
        });
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `${accent}${Math.round((1 - dist / 100) * 80).toString(16).padStart(2,'0')}`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      if (theme.bgAnimation === 'bubbles') {
        bubbles.forEach(b => {
          b.x += b.vx; b.y += b.vy;
          if (b.y + b.r < 0) { b.y = H + b.r; b.x = Math.random() * W; }
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = `${accent}40`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = `${accent}${Math.round(b.alpha * 255).toString(16).padStart(2,'0')}`;
          ctx.fill();
        });
      }

      if (theme.bgAnimation === 'waves') {
        waveOffset += 0.02;
        for (let wave = 0; wave < 4; wave++) {
          ctx.beginPath();
          ctx.moveTo(0, H);
          for (let x = 0; x <= W; x += 4) {
            const y = H * 0.5 + Math.sin(x * 0.008 + waveOffset + wave * 0.8) * (60 + wave * 20)
              + Math.cos(x * 0.005 + waveOffset * 0.7 + wave) * 30;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(W, H); ctx.closePath();
          ctx.fillStyle = `${accent}${(8 + wave * 6).toString(16).padStart(2,'0')}`;
          ctx.fill();
        }
      }

      if (theme.bgAnimation === 'rings') {
        rings.forEach(ring => {
          ring.r += ring.speed;
          ring.alpha -= 0.003;
          if (ring.r > ring.maxR || ring.alpha <= 0) {
            ring.r = 0; ring.alpha = 0.6;
            ring.x = Math.random() * W; ring.y = Math.random() * H;
          }
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
          ctx.strokeStyle = `${ring.color}${Math.round(ring.alpha * 255).toString(16).padStart(2,'0')}`;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }

      animFrame = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [theme.bgAnimation, theme.gradientPreset]);

  useEffect(() => {
    const cleanup = draw();
    const onResize = () => { draw(); };
    window.addEventListener('resize', onResize);
    return () => {
      cleanup?.();
      window.removeEventListener('resize', onResize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

export default AnimatedBackground;
