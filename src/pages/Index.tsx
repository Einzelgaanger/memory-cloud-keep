
import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import Header from '@/components/Header';
import JournalPage from '@/components/JournalPage';
import EventsPage from '@/components/EventsPage';
import SettingsPage from '@/components/SettingsPage';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'journal' | 'events' | 'settings'>('journal');

  // Check for existing session on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('diary-auth');
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (password: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('diary-auth', 'authenticated');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('diary-auth');
    setActiveTab('journal');
  };

  const handleTabChange = (tab: 'journal' | 'events' | 'settings') => {
    setActiveTab(tab);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLogout={handleLogout} 
      />
      
      <main className="min-h-[calc(100vh-4rem)]">
        {activeTab === 'journal' && <JournalPage />}
        {activeTab === 'events' && <EventsPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
};

export default Index;
