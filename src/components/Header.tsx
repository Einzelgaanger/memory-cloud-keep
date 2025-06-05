
import React from 'react';
import { Book, Calendar, Settings, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeTab: 'journal' | 'events' | 'settings';
  onTabChange: (tab: 'journal' | 'events' | 'settings') => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onLogout }) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Alfred's Sacred Space
                </h1>
                <p className="text-xs text-gray-500 font-medium">Where mathematics meets the soul</p>
              </div>
            </div>
          </div>

          <nav className="flex items-center space-x-2">
            <Button
              variant={activeTab === 'journal' ? 'default' : 'ghost'}
              onClick={() => onTabChange('journal')}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                activeTab === 'journal' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-indigo-50'
              }`}
            >
              <Book className="w-4 h-4" />
              <span>Sacred Journal</span>
            </Button>
            
            <Button
              variant={activeTab === 'events' ? 'default' : 'ghost'}
              onClick={() => onTabChange('events')}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                activeTab === 'events' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-indigo-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Life Events</span>
            </Button>
            
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              onClick={() => onTabChange('settings')}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                activeTab === 'settings' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-indigo-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-gray-600 hover:text-red-600 flex items-center space-x-2 ml-4 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
