
import React, { useState } from 'react';
import { Plus, Search, Filter, BookOpen, Paperclip, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JournalEntryForm from './JournalEntryForm';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  tags: string[];
  attachments: string[];
}

const JournalPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'A Beautiful Day',
      content: 'Today was filled with sunshine and joy. I spent time in the garden and reflected on life\'s simple pleasures...',
      date: '2024-06-05',
      mood: 'happy',
      tags: ['gratitude', 'nature'],
      attachments: ['photo1.jpg', 'sketch.png']
    }
  ]);

  const handleAddEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setEntries([newEntry, ...entries]);
    setShowForm(false);
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      excited: '🎉',
      calm: '😌',
      anxious: '😰',
      grateful: '🙏'
    };
    return moodMap[mood] || '😊';
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (showForm) {
    return <JournalEntryForm onSave={handleAddEntry} onCancel={() => setShowForm(false)} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            My Journal
          </h2>
          <p className="text-gray-600 mt-2">Capture your thoughts, memories, and emotions</p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search your entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Entries Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] bg-white border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {entry.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
                {entry.content}
              </p>
              
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {entry.attachments.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Paperclip className="w-3 h-3" />
                  <span>{entry.attachments.length} attachment{entry.attachments.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No entries found</h3>
          <p className="text-gray-400 mb-6">Start writing your first journal entry to capture your thoughts and memories</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write Your First Entry
          </Button>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
