
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/LoginForm';
import Header from '@/components/Header';
import JournalPage from '@/components/JournalPage';
import EventsPage from '@/components/EventsPage';
import SettingsPage from '@/components/SettingsPage';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'journal' | 'events' | 'settings'>('journal');
  const [loading, setLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
          return;
        }
        
        if (session) {
          setIsAuthenticated(true);
          console.log('User authenticated:', session.user.email);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          toast({
            title: "Welcome back, Alfred!",
            description: "Your sacred space awaits your thoughts and plans.",
          });
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setActiveTab('journal');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (password: string) => {
    try {
      // Sign in with fixed email and provided password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'alfred@mulingediary.com',
        password: password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          // If user doesn't exist, create account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'alfred@mulingediary.com',
            password: password,
            options: {
              data: {
                full_name: 'Alfred Mulinge'
              }
            }
          });

          if (signUpError) {
            throw signUpError;
          }

          if (signUpData.user) {
            setIsAuthenticated(true);
            toast({
              title: "Account created successfully!",
              description: "Welcome to your sacred space, Alfred.",
            });
          }
        } else {
          throw error;
        }
      } else if (data.user) {
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your password and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout failed",
          description: "There was an error signing out. Please try again.",
          variant: "destructive",
        });
      } else {
        setIsAuthenticated(false);
        setActiveTab('journal');
        toast({
          title: "Until next time, Alfred",
          description: "Your thoughts and plans are safely stored.",
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleTabChange = (tab: 'journal' | 'events' | 'settings') => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sacred space...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
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
