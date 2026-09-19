import React, { useState } from 'react';
import { Plus, Undo2, Redo2, X, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

interface FABProps {
  onThemeToggle?: () => void;
}

const FAB: React.FC<FABProps> = ({ onThemeToggle }) => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleUndo = () => {
    if (history.length === 0) { toast.info('Nothing to undo.'); return; }
    setHistory(prev => prev.slice(0, -1));
    toast.info('Undone.');
  };

  const handleRedo = () => {
    toast.info('Redo: No future actions available.');
  };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-[90] w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shadow-lg transition-all hover:scale-110"
        style={{ background: 'var(--neon-color, #4a6cf7)' }}
        title="Expand FAB"
      >
        <Maximize2 size={14} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-2">
      {/* Mini actions */}
      {open && (
        <div className="flex flex-col items-end gap-2 animate-in slide-in-from-bottom-2">
          <button
            onClick={handleUndo}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            title="Undo"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={handleRedo}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            title="Redo"
          >
            <Redo2 size={14} />
          </button>
          {onThemeToggle && (
            <button
              onClick={() => { onThemeToggle(); setOpen(false); }}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-base transition-all hover:scale-105"
              title="Theme Designer"
            >
              🎨
            </button>
          )}
          <button
            onClick={() => setMinimized(true)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            title="Minimize"
          >
            <Minimize2 size={14} />
          </button>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 active:scale-95"
        style={{
          background: `linear-gradient(135deg, var(--neon-color, #4a6cf7), var(--accent-color, #4a6cf7))`,
          boxShadow: `0 4px 20px var(--neon-color, #4a6cf7)60`,
        }}
        title="Actions"
      >
        <div className={`transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          {open ? <X size={20} /> : <Plus size={20} />}
        </div>
      </button>
    </div>
  );
};

export default FAB;
