
import React, { useState } from 'react';
import { ChitConfig, UserRole, AppData } from '../types';
import { Save, Info, Check, LogOut, Lock, ShieldCheck, Calendar, Wallet, Share2, Copy } from 'lucide-react';

interface ChitSettingsProps {
  config: ChitConfig;
  data: AppData;
  userRole: UserRole;
  onUpdateConfig: (config: any) => void;
  onLogout: () => void;
}

export const ChitSettings: React.FC<ChitSettingsProps> = ({ config, data, userRole, onUpdateConfig, onLogout }) => {
  const isAdmin = userRole === UserRole.ADMIN;
  const [formData, setFormData] = useState(config);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    onUpdateConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const generateSyncLink = () => {
    const jsonString = JSON.stringify(data);
    const encoded = btoa(encodeURIComponent(jsonString));
    const url = `${window.location.origin}${window.location.pathname}#data=${encoded}`;
    
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic">Account Session</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Logged in as {userRole}</p>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 border border-rose-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
      </div>

      {/* Share Sync Link Section - CRITICAL FOR SYNC */}
      {isAdmin && (
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 border border-indigo-500">
           <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl">
                 <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tight">Share Access</h3>
                <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-[0.2em] mt-0.5">Sync data with other members</p>
              </div>
           </div>
           
           <p className="text-xs font-medium text-indigo-50/80 mb-8 leading-relaxed">
             Since this app runs offline, you must generate a **Sync Link** whenever you update member payments. Send this link to your group so their mobile phones can see your latest records.
           </p>

           <button 
             onClick={generateSyncLink}
             className={`w-full py-4 rounded-2xl flex items-center justify-center space-x-3 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
               copied ? 'bg-emerald-500 text-white' : 'bg-white text-indigo-700 hover:bg-indigo-50'
             }`}
           >
             {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
             <span>{copied ? 'Link Copied to Clipboard' : 'Generate & Copy Sync Link'}</span>
           </button>
           <p className="text-[9px] text-center text-indigo-200 font-black uppercase tracking-widest mt-4 italic">
             Copy this link and send it via WhatsApp to your group.
           </p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Group Configuration</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Global Chit Fund Rules</p>
          </div>
          {!isAdmin && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
               <Lock className="w-3 h-3" />
               <span>Read Only</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className={`p-8 space-y-6 ${!isAdmin ? 'opacity-70 grayscale-[0.2]' : ''}`}>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Chit Fund Name</label>
              <input 
                disabled={!isAdmin}
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-slate-800 disabled:cursor-not-allowed outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Total Fund Value (₹)</label>
                <input 
                  disabled={!isAdmin}
                  type="number" 
                  value={formData.totalChitValue} 
                  onChange={(e) => setFormData({ ...formData, totalChitValue: parseInt(e.target.value) || 0 })} 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-indigo-600 disabled:cursor-not-allowed outline-none focus:border-indigo-500 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fixed Monthly/Member (₹)</label>
                <input 
                  disabled={!isAdmin}
                  type="number" 
                  value={formData.fixedMonthlyCollection} 
                  onChange={(e) => setFormData({ ...formData, fixedMonthlyCollection: parseInt(e.target.value) || 0 })} 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-emerald-600 disabled:cursor-not-allowed outline-none focus:border-indigo-500 transition-colors" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Monthly Payout Base (₹)</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input 
                      disabled={!isAdmin}
                      type="number" 
                      value={formData.monthlyPayoutBase} 
                      onChange={(e) => setFormData({ ...formData, monthlyPayoutBase: parseInt(e.target.value) || 0 })} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-slate-800 disabled:cursor-not-allowed outline-none focus:border-indigo-500 transition-colors" 
                      placeholder="e.g. 25000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Total Duration (Months)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                    <input 
                      disabled={!isAdmin}
                      type="number" 
                      value={formData.durationMonths} 
                      onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 0 })} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-slate-800 disabled:cursor-not-allowed outline-none focus:border-indigo-500 transition-colors" 
                    />
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Start Date</label>
                <input 
                  disabled={!isAdmin}
                  type="date" 
                  value={formData.startDate} 
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-slate-800 disabled:cursor-not-allowed outline-none focus:border-indigo-500 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Admin Phone</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <input 
                    disabled={!isAdmin}
                    type="tel" 
                    value={formData.adminPhone} 
                    onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })} 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-slate-800 disabled:cursor-not-allowed outline-none focus:border-indigo-500 transition-colors" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-[10px] text-indigo-600 font-black uppercase tracking-widest bg-indigo-50 px-4 py-3 rounded-2xl border border-indigo-100 flex-1 w-full sm:w-auto leading-relaxed">
              <Info className="w-4 h-4 mr-2 flex-shrink-0" /> 
              Payout is calculated as: Standard Payout Base - Action Amount.
            </div>
            {isAdmin && (
              <button type="submit" className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-10 py-4 rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-xs active:scale-95 ${saved ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}>
                {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                <span>{saved ? 'Settings Saved' : 'Apply Changes'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
