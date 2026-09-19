import React, { useState } from 'react';
import {
  Shield, Users, Plug, ToggleLeft, ToggleRight, Ban, UserCheck,
  Trash2, Eye, Database, Key, Globe, Mail, Plus, ChevronRight,
  Activity, Lock, X, AlertTriangle
} from 'lucide-react';
import GlassCard from '@/components/features/GlassCard';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface Integration {
  id: string; name: string; type: string; status: 'active' | 'inactive';
  key: string; icon: React.ReactNode;
}

const INTEGRATIONS_DEFAULT: Integration[] = [
  { id: '1', name: 'Resend Email API', type: 'Email',      status: 'inactive', key: '', icon: <Mail size={15} /> },
  { id: '2', name: 'Cloudflare',       type: 'DNS/CDN',   status: 'inactive', key: '', icon: <Globe size={15} /> },
  { id: '3', name: 'Supabase',         type: 'Database',  status: 'inactive', key: '', icon: <Database size={15} /> },
  { id: '4', name: 'Custom API',       type: 'Custom',    status: 'inactive', key: '', icon: <Plug size={15} /> },
];

type AdminTab = 'overview' | 'users' | 'integrations' | 'security';

interface AdminPanelProps { onClose: () => void; }

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { auth, getAllUsers, banUser, suspendUser } = useAuthStore();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS_DEFAULT);
  const [globalFeatures, setGlobalFeatures] = useState({ mfa: true, magicLink: true, biometric: true, registration: true });
  const [newIntName, setNewIntName] = useState('');
  const users = getAllUsers();

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i));
    toast.success('Integration status updated.');
  };

  const toggleFeature = (key: keyof typeof globalFeatures) => {
    setGlobalFeatures(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`Feature ${globalFeatures[key] ? 'disabled' : 'enabled'}.`);
  };

  const tabs: { id: AdminTab; icon: React.ReactNode; label: string }[] = [
    { id: 'overview',     icon: <Activity size={14} />,  label: 'Overview' },
    { id: 'users',        icon: <Users size={14} />,     label: 'Users' },
    { id: 'integrations', icon: <Plug size={14} />,      label: 'Integrations' },
    { id: 'security',     icon: <Shield size={14} />,    label: 'Security' },
  ];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className="relative w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden" neon>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/20 border border-red-500/30">
              <Lock size={15} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">GOD MODE Admin Panel</h2>
              <p className="text-white/30 text-[10px]">Supreme Command & Control · {auth.user?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 shrink-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all ${
                tab === t.id ? 'text-white border-b-2 border-red-400' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">

          {/* Overview */}
          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Users', value: users.length, color: '#60a5fa' },
                  { label: 'Active',      value: users.filter(u => !u.banned && !u.suspended).length, color: '#34d399' },
                  { label: 'Banned',      value: users.filter(u => u.banned).length,    color: '#f87171' },
                  { label: 'Suspended',   value: users.filter(u => u.suspended).length, color: '#fbbf24' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-white/40 text-[11px] mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">Global Feature Toggles</p>
                <div className="space-y-2">
                  {Object.entries(globalFeatures).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10">
                      <span className="text-white/80 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <button onClick={() => toggleFeature(key as keyof typeof globalFeatures)}>
                        {val
                          ? <ToggleRight size={24} style={{ color: 'var(--accent-color, #4a6cf7)' }} />
                          : <ToggleLeft size={24} className="text-white/30" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={14} className="text-yellow-400" />
                <p className="text-yellow-400/80 text-xs">All actions take immediate effect.</p>
              </div>
              {users.map(user => (
                <div key={user.id} className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{user.name}</p>
                    <p className="text-white/40 text-xs truncate">{user.email}</p>
                    <div className="flex gap-1 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {user.role}
                      </span>
                      {user.verified && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-300">verified</span>}
                      {user.banned && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/30 text-red-300">banned</span>}
                      {user.suspended && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">suspended</span>}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => { banUser(user.id); toast.success(`User ${user.banned ? 'unbanned' : 'banned'}.`); }}
                      title={user.banned ? 'Unban' : 'Ban'}
                      className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition-colors"
                    >
                      <Ban size={13} />
                    </button>
                    <button
                      onClick={() => { suspendUser(user.id); toast.success(`User ${user.suspended ? 'unsuspended' : 'suspended'}.`); }}
                      title={user.suspended ? 'Unsuspend' : 'Suspend'}
                      className="p-1.5 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/30 text-yellow-400 transition-colors"
                    >
                      <UserCheck size={13} />
                    </button>
                    <button
                      onClick={() => toast.info('Impersonate: Requires backend session swap.')}
                      title="Impersonate"
                      className="p-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-400 transition-colors"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => toast.error('Delete: Irreversible — requires backend.')}
                      title="Delete"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Integrations */}
          {tab === 'integrations' && (
            <div className="space-y-3">
              {integrations.map(int => (
                <div key={int.id} className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/60 shrink-0">
                    {int.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{int.name}</p>
                    <p className="text-white/30 text-xs">{int.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${int.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-white/30'}`}>
                      {int.status}
                    </span>
                    <button onClick={() => toggleIntegration(int.id)}>
                      {int.status === 'active'
                        ? <ToggleRight size={22} style={{ color: 'var(--accent-color, #4a6cf7)' }} />
                        : <ToggleLeft size={22} className="text-white/30" />}
                    </button>
                    <button onClick={() => toast.info('Configure: Enter API key in the vault.')}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                      <Key size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text" placeholder="New integration name..."
                  value={newIntName} onChange={e => setNewIntName(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 text-xs outline-none focus:border-white/40 transition-all"
                />
                <button
                  onClick={() => {
                    if (!newIntName.trim()) return;
                    setIntegrations(prev => [...prev, { id: Date.now().toString(), name: newIntName, type: 'Custom', status: 'inactive', key: '', icon: <Plug size={15} /> }]);
                    setNewIntName('');
                    toast.success('Integration slot added.');
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-white flex items-center gap-1.5 transition-all hover:opacity-90"
                  style={{ background: 'var(--neon-color, #4a6cf7)' }}
                >
                  <Plus size={13} /> Add
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {tab === 'security' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'JWT Rotation',        desc: 'Every 15 minutes',       active: true,  icon: <Key size={14} /> },
                  { label: 'Session Timeout',     desc: '15 min inactivity',      active: true,  icon: <Lock size={14} /> },
                  { label: 'Device Fingerprint',  desc: 'Enabled on all logins',  active: true,  icon: <Shield size={14} /> },
                  { label: 'Brute Force Guard',   desc: 'Lockout after 5 tries',  active: true,  icon: <Ban size={14} /> },
                ].map(item => (
                  <div key={item.label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: 'var(--accent-color)' }}>{item.icon}</span>
                      <span className="text-white text-sm font-medium">{item.label}</span>
                      <span className="ml-auto text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded-full">ON</span>
                    </div>
                    <p className="text-white/30 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 text-xs font-semibold">Security Note</p>
                    <p className="text-yellow-400/60 text-xs mt-1">Full security enforcement requires OnSpace Cloud backend. Current session management is localStorage-based for demo purposes.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminPanel;
