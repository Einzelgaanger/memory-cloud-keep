
import React, { useState } from 'react';
import { Save, X, Paperclip, Tag, Calendar, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface JournalEntryFormProps {
  onSave: (entry: {
    title: string;
    content: string;
    date: string;
    mood: string;
    tags: string[];
    attachments: string[];
  }) => void;
  onCancel: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  const moods = [
    { value: 'happy', label: '😊 Happy', color: 'text-yellow-600' },
    { value: 'sad', label: '😢 Sad', color: 'text-blue-600' },
    { value: 'excited', label: '🎉 Excited', color: 'text-orange-600' },
    { value: 'calm', label: '😌 Calm', color: 'text-green-600' },
    { value: 'anxious', label: '😰 Anxious', color: 'text-red-600' },
    { value: 'grateful', label: '🙏 Grateful', color: 'text-purple-600' }
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const fileNames = files.map(file => file.name);
    setAttachments([...attachments, ...fileNames]);
    toast({
      title: "Files attached",
      description: `${files.length} file(s) ready to upload to cloud storage.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !mood) {
      toast({
        title: "Missing information",
        description: "Please fill in the title, content, and mood.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      date,
      mood,
      tags,
      attachments
    });

    toast({
      title: "Entry saved!",
      description: "Your journal entry has been saved successfully.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Smile className="w-7 h-7 text-blue-600" />
            New Journal Entry
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's on your mind today?"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Smile className="w-4 h-4" />
                How are you feeling?
              </label>
              <Select value={mood} onValueChange={setMood} required>
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((moodOption) => (
                    <SelectItem key={moodOption.value} value={moodOption.value}>
                      <span className={moodOption.color}>{moodOption.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your thoughts
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write about your day, thoughts, feelings, or anything that comes to mind..."
                className="min-h-[200px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                      #{tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Paperclip className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600">Click to upload files</span>
                  <span className="text-xs text-gray-400">Images, documents, audio, video</span>
                </label>
              </div>
              {attachments.length > 0 && (
                <div className="mt-3 space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <Paperclip className="w-3 h-3" />
                      {file}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Entry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalEntryForm;
