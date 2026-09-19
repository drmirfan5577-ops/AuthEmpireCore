import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Settings, Shield, LogOut, Bell, BarChart3, Users } from 'lucide-react';
import GlassCard from '@/components/features/GlassCard';
import { useAuthStore } from '@/stores/authStore';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
  adminOnly?: boolean;
}

const LEFT_ITEMS: SidebarItem[] = [
  { icon: <Home size={18} />,     label: 'Home',       path: '/' },
  { icon: <BarChart3 size={18} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <Bell size={18} />,     label: 'Alerts',     path: '/dashboard', badge: 3 },
];

const RIGHT_ITEMS: SidebarItem[] = [
  { icon: <Settings size={18} />, label: 'Settings',  path: '/dashboard' },
  { icon: <Users size={18} />,    label: 'Users',     path: '/dashboard', adminOnly: true },
  { icon: <Shield size={18} />,   label: 'Security',  path: '/dashboard' },
];

interface StarSidebarProps {
  side: 'left' | 'right';
}

const StarSidebar: React.FC<StarSidebarProps> = ({ side }) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const { auth, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const items = side === 'left' ? LEFT_ITEMS : RIGHT_ITEMS;

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), 5000);
  };

  useEffect(() => {
    if (open) resetTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open]);

  const toggleOpen = () => {
    setOpen(prev => !prev);
    if (!open) resetTimer();
  };

  const visibleItems = items.filter(item => !item.adminOnly || auth.user?.role === 'admin');

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-[80] flex items-center ${side === 'left' ? 'left-0 flex-row' : 'right-0 flex-row-reverse'}`}
      onMouseEnter={resetTimer}
    >
      {/* Star trigger */}
      <button
        onClick={toggleOpen}
        className={`w-8 h-8 flex items-center justify-center rounded-full text-base transition-all duration-300 ${
          side === 'left' ? 'rounded-l-none' : 'rounded-r-none'
        } ${open ? 'bg-yellow-500/30 text-yellow-300' : 'bg-white/10 text-white/40 hover:bg-white/20 hover:text-yellow-300'}`}
        style={{
          boxShadow: open ? '0 0 12px rgba(253,224,71,0.4)' : undefined,
        }}
        title={`${open ? 'Hide' : 'Show'} ${side} sidebar`}
      >
        ⭐
      </button>

      {/* Sidebar panel */}
      <div
        className={`transition-all duration-300 overflow-hidden ${open ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}`}
      >
        <GlassCard neon className={`py-2 px-1 flex flex-col gap-1 ${side === 'left' ? 'rounded-l-none' : 'rounded-r-none'}`}>
          {visibleItems.map((item, i) => (
            <button
              key={i}
              onClick={() => { navigate(item.path); setOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap hover:bg-white/15 ${
                location.pathname === item.path ? 'text-white bg-white/10' : 'text-white/60 hover:text-white'
              }`}
            >
              <span style={{ color: 'var(--accent-color)' }}>{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {auth.isAuthenticated && side === 'right' && (
            <button
              onClick={() => { logout(); navigate('/'); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-all whitespace-nowrap mt-1 border-t border-white/10 pt-2"
            >
              <LogOut size={15} /> Sign Out
            </button>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default StarSidebar;
