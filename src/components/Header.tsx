
import React from 'react';
import { Book, Calendar, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeTab: 'journal' | 'events' | 'settings';
  onTabChange: (tab: 'journal' | 'events' | 'settings') => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onLogout }) => {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Diary
              </h1>
            </div>
          </div>

          <nav className="flex items-center space-x-2">
            <Button
              variant={activeTab === 'journal' ? 'default' : 'ghost'}
              onClick={() => onTabChange('journal')}
              className={`flex items-center space-x-2 ${
                activeTab === 'journal' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Book className="w-4 h-4" />
              <span>Journal</span>
            </Button>
            
            <Button
              variant={activeTab === 'events' ? 'default' : 'ghost'}
              onClick={() => onTabChange('events')}
              className={`flex items-center space-x-2 ${
                activeTab === 'events' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </Button>
            
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              onClick={() => onTabChange('settings')}
              className={`flex items-center space-x-2 ${
                activeTab === 'settings' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-gray-600 hover:text-red-600 flex items-center space-x-2 ml-4"
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
