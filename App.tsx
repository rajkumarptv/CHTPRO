
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PaymentGrid } from './components/PaymentGrid';
import { MemberList } from './components/MemberList';
import { AIInsights } from './components/AIInsights';
import { ChitSettings } from './components/ChitSettings';
import { Login } from './components/Login';
import { AppData, PaymentStatus, Member, UserRole, AuthState, PaymentMethod } from './types';
import { calculatePaymentDate } from './utils/dateUtils';

const INITIAL_DATA: AppData = {
  config: {
    id: 'chit-1',
    name: '5 Lakh Premium Group',
    totalChitValue: 500000,
    fixedMonthlyCollection: 2000,
    monthlyPayoutBase: 25000,
    durationMonths: 20,
    startDate: '2024-01-01',
    adminPhone: '9876543210'
  },
  members: Array.from({ length: 12 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `Member ${i + 1}`,
    phone: `555-010${i + 1}`,
    joinDate: '2024-01-01',
    isSideFundMember: true
  })),
  payments: [],
  auctions: []
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('chittrack_data_v6');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('chittrack_auth');
    return savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false, role: UserRole.MEMBER, phoneNumber: '' };
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'payments' | 'members' | 'ai' | 'settings'>('dashboard');

  useEffect(() => {
    localStorage.setItem('chittrack_data_v6', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('chittrack_auth', JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (newAuth: AuthState) => {
    setAuth(newAuth);
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, role: UserRole.MEMBER, phoneNumber: '' });
  };

  const handleUpdatePayment = (
    memberId: string, 
    monthIndex: number, 
    status: PaymentStatus, 
    method?: PaymentMethod,
    extraAmount: number = 0,
    customDate?: string
  ) => {
    if (auth.role !== UserRole.ADMIN) return;
    
    setData(prev => {
      const existingIdx = prev.payments.findIndex(p => p.memberId === memberId && p.monthIndex === monthIndex);
      const newPayments = [...prev.payments];
      
      const amount = prev.config.fixedMonthlyCollection;

      const paymentDate = status === PaymentStatus.PAID 
        ? (customDate || calculatePaymentDate(prev.config.startDate, monthIndex))
        : undefined;

      if (existingIdx >= 0) {
        newPayments[existingIdx] = { 
          ...newPayments[existingIdx], 
          status, 
          amount,
          extraAmount,
          method: status === PaymentStatus.PAID ? method : undefined,
          paymentDate 
        };
      } else {
        newPayments.push({
          memberId,
          monthIndex,
          amount,
          extraAmount,
          status,
          method: status === PaymentStatus.PAID ? method : undefined,
          paymentDate
        });
      }
      
      return { ...prev, payments: newPayments };
    });
  };

  const handleUpdateAuction = (monthIndex: number, auctionAmount: number) => {
    if (auth.role !== UserRole.ADMIN) return;
    setData(prev => {
      const newAuctions = [...prev.auctions];
      const idx = newAuctions.findIndex(a => a.monthIndex === monthIndex);
      if (idx >= 0) {
        newAuctions[idx] = { ...newAuctions[idx], auctionAmount };
      } else {
        newAuctions.push({ monthIndex, auctionAmount });
      }
      return { ...prev, auctions: newAuctions };
    });
  };

  const handleUpdateConfig = (config: any) => {
    if (auth.role !== UserRole.ADMIN) return;
    setData(prev => ({ ...prev, config: { ...prev.config, ...config } }));
  };

  const handleAddMember = (member: Omit<Member, 'id'>) => {
    if (auth.role !== UserRole.ADMIN) return;
    const newMember = { ...member, id: Math.random().toString(36).substr(2, 9) };
    setData(prev => ({ ...prev, members: [...prev.members, newMember] }));
  };

  const handleUpdateMember = (id: string, updatedMember: Partial<Member>) => {
    if (auth.role !== UserRole.ADMIN) return;
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, ...updatedMember } : m)
    }));
  };

  const handleDeleteMember = (id: string) => {
    if (auth.role !== UserRole.ADMIN) return;
    setData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id),
      payments: prev.payments.filter(p => p.memberId !== id)
    }));
  };

  if (!auth.isAuthenticated) {
    return <Login data={data} onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      userRole={auth.role} 
      userName={auth.userName}
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && <Dashboard data={data} />}
      {activeTab === 'payments' && (
        <PaymentGrid 
          data={data} 
          userRole={auth.role}
          onUpdateStatus={handleUpdatePayment} 
          onUpdateAuction={handleUpdateAuction}
        />
      )}
      {activeTab === 'members' && (
        <MemberList 
          members={data.members} 
          userRole={auth.role}
          onAddMember={handleAddMember} 
          onUpdateMember={handleUpdateMember}
          onDeleteMember={handleDeleteMember}
        />
      )}
      {activeTab === 'ai' && <AIInsights data={data} userRole={auth.role} />}
      {activeTab === 'settings' && (
        <ChitSettings 
          config={data.config} 
          userRole={auth.role}
          onUpdateConfig={handleUpdateConfig}
          onLogout={handleLogout}
        />
      )}
    </Layout>
  );
};

export default App;
