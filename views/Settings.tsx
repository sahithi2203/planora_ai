import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '../components/ui';
import { User } from '../types';
import { User as UserIcon, Mail, Bell, Shield, Smartphone, Key, Save, Camera, AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout }) => {
  const [formData, setFormData] = useState({
      name: user.name,
      email: user.email
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
  });
  const [securityState, setSecurityState] = useState({
    lastPasswordChange: '3 months ago',
    twoFactorEnabled: false
  });
  const [isSaved, setIsSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if user prop changes externally
  useEffect(() => {
      setFormData({ name: user.name, email: user.email });
  }, [user]);

  const handleSave = () => {
      onUpdateUser(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChangePassword = () => {
    // Simulation
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setSecurityState(prev => ({ ...prev, lastPasswordChange: `Just now (${date})` }));
    alert(`Password reset instructions sent to ${user.email}`);
  };

  const toggleTwoFactor = () => {
    setSecurityState(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpdateUser({ avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
      // In a real app, this would make an API call to delete the user
      // For this demo, we'll log them out and clear data via the passed handler
      onLogout();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Account Settings</h1>

      <Card title="Profile Information">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
             {/* Profile Image Upload */}
             <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 relative overflow-hidden group-hover:border-violet-500 transition-colors">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon className="w-10 h-10 text-slate-400" />
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                 </div>
                 <div className="absolute -bottom-1 -right-1 bg-violet-600 rounded-full p-1.5 border-2 border-slate-900">
                     <Camera className="w-3 h-3 text-white" />
                 </div>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                 />
             </div>

             <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <input 
                            type="email" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors" 
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                    <Button variant="primary" onClick={handleSave} className="w-32">
                        {isSaved ? 'Saved!' : 'Save Changes'}
                    </Button>
                </div>
             </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Notifications">
            <div className="space-y-4">
                {[
                    { key: 'email', label: 'Email Alerts', desc: 'Get weekly curriculum summaries' },
                    { key: 'push', label: 'Push Notifications', desc: 'Real-time updates on analysis' },
                    { key: 'marketing', label: 'Marketing', desc: 'Product updates and offers' }
                ].map((item) => {
                    const isOn = notifications[item.key as keyof typeof notifications];
                    return (
                        <div key={item.key} className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-white">{item.label}</p>
                                <p className="text-xs text-slate-400">{item.desc}</p>
                            </div>
                            <button 
                                onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                                className={`w-11 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${isOn ? 'bg-violet-600' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${isOn ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    );
                })}
            </div>
        </Card>

        <Card title="Security">
            <div className="space-y-2">
                 <div className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                    <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium text-white">Change Password</p>
                            <p className="text-xs text-slate-500">Last changed: {securityState.lastPasswordChange}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="px-3 py-1 text-xs h-8" onClick={handleChangePassword}>Update</Button>
                 </div>
                 <div className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                    <div className="flex items-center gap-3">
                        <Shield className={`w-5 h-5 ${securityState.twoFactorEnabled ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <div>
                            <p className="text-sm font-medium text-white">2FA Authentication</p>
                            <p className={`text-xs ${securityState.twoFactorEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {securityState.twoFactorEnabled ? 'Enabled' : 'Currently disabled'}
                            </p>
                        </div>
                    </div>
                    <Button 
                        variant={securityState.twoFactorEnabled ? "secondary" : "outline"} 
                        className={`px-3 py-1 text-xs h-8 ${securityState.twoFactorEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}`}
                        onClick={toggleTwoFactor}
                    >
                        {securityState.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </Button>
                 </div>
            </div>
        </Card>
      </div>

      <div className="pt-6 border-t border-white/5">
        <h3 className="text-lg font-bold text-rose-500 mb-2">Danger Zone</h3>
        <div className={`flex flex-col md:flex-row items-center justify-between p-4 border rounded-xl transition-all duration-300 ${deleteConfirm ? 'bg-rose-900/20 border-rose-500/50' : 'bg-rose-500/5 border-rose-500/20'}`}>
            <div className="mb-4 md:mb-0">
                <p className="font-medium text-white flex items-center gap-2">
                    {deleteConfirm && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                    {deleteConfirm ? 'Are you absolutely sure?' : 'Delete Account'}
                </p>
                <p className="text-sm text-slate-400">
                    {deleteConfirm 
                        ? 'This action cannot be undone. All your data will be permanently lost.' 
                        : 'Permanently remove your account and all data.'}
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                {deleteConfirm && (
                    <Button 
                        variant="ghost" 
                        onClick={() => setDeleteConfirm(false)}
                        className="text-slate-400 hover:text-white"
                    >
                        Cancel
                    </Button>
                )}
                <Button 
                    className={`${deleteConfirm ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-800 hover:bg-rose-900/50 text-rose-400 border border-rose-900/50'} shadow-none transition-colors`}
                    onClick={() => {
                        if (deleteConfirm) {
                            handleDeleteAccount();
                        } else {
                            setDeleteConfirm(true);
                        }
                    }}
                >
                    {deleteConfirm ? 'Yes, Delete Account' : 'Delete Account'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};