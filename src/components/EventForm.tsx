
import React, { useState } from 'react';
import { Save, X, MapPin, Clock, Calendar, AlertCircle, FileText, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface EventFormProps {
  onSave: (event: {
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    requirements: string[];
    notes: string;
    priority: 'low' | 'medium' | 'high';
    attachments: string[];
  }) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [attachments, setAttachments] = useState<string[]>([]);

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' }
  ];

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (reqToRemove: string) => {
    setRequirements(requirements.filter(req => req !== reqToRemove));
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
    if (!title.trim() || !date || !time || !venue.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in the title, date, time, and venue.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      venue: venue.trim(),
      requirements,
      notes: notes.trim(),
      priority,
      attachments
    });

    toast({
      title: "Event created!",
      description: "Your event has been saved successfully.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-blue-600" />
            New Event
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title..."
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Priority
                </label>
                <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event..."
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time
                </label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Venue
              </label>
              <Input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Enter venue or location..."
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add a requirement..."
                  className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                />
                <Button type="button" onClick={handleAddRequirement} variant="outline">
                  Add
                </Button>
              </div>
              {requirements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {requirements.map((req) => (
                    <Badge key={req} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer" onClick={() => handleRemoveRequirement(req)}>
                      {req} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or reminders..."
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                rows={3}
              />
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
                  id="event-file-upload"
                  accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                />
                <label
                  htmlFor="event-file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Paperclip className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600">Click to upload event files</span>
                  <span className="text-xs text-gray-400">Documents, images, tickets, confirmations</span>
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
                Save Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
