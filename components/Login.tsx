
import React, { useState } from 'react';
import { Smartphone, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { AppData, UserRole, AuthState } from '../types';

interface LoginProps {
  data: AppData;
  onLogin: (auth: AuthState) => void;
}

export const Login: React.FC<LoginProps> = ({ data, onLogin }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const sanitizedPhone = phone.replace(/\D/g, '');
      const adminPhone = data.config.adminPhone.replace(/\D/g, '');
      
      if (sanitizedPhone === adminPhone) {
        onLogin({ isAuthenticated: true, role: UserRole.ADMIN, phoneNumber: phone, userName: 'Administrator' });
        return;
      }

      const member = data.members.find(m => m.phone.replace(/\D/g, '') === sanitizedPhone);
      if (member) {
        onLogin({ isAuthenticated: true, role: UserRole.MEMBER, phoneNumber: phone, userName: member.name });
        return;
      }

      setError('Number not recognized in system.');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200 mb-6">
            C
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to ChitTrack</h1>
          <p className="text-slate-500 text-sm mt-1">Professional fund management suite</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest ml-1">Mobile Number</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="tel"
                required
                placeholder="Enter registered mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-3 p-4 bg-rose-50 rounded-xl text-rose-600 text-sm font-medium border border-rose-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading || phone.length < 10}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Continue</span>
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center space-x-2 text-slate-400">
           <ShieldCheck className="w-4 h-4" />
           <p className="text-xs font-medium uppercase tracking-widest">Secure Cloud Access</p>
        </div>
      </div>
      <p className="mt-8 text-slate-400 text-sm">© 2024 ChitTrack Pro. All rights reserved.</p>
    </div>
  );
};
