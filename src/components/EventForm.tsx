
import React, { useState, useEffect } from 'react';
import { Save, X, MapPin, Clock, Calendar, AlertCircle, FileText, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  requirements: string[];
  notes: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'rescheduled';
  attachments: string[];
  created_at: string;
  updated_at: string;
}

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
    status: 'pending' | 'completed' | 'rescheduled';
    attachments: string[];
  }) => void;
  onCancel: () => void;
  editingEvent?: Event | null;
}

const EventForm: React.FC<EventFormProps> = ({ onSave, onCancel, editingEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'pending' | 'completed' | 'rescheduled'>('pending');
  const [attachments, setAttachments] = useState<string[]>([]);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description);
      setDate(editingEvent.date);
      setTime(editingEvent.time);
      setVenue(editingEvent.venue);
      setRequirements(editingEvent.requirements);
      setNotes(editingEvent.notes);
      setPriority(editingEvent.priority);
      setStatus(editingEvent.status);
      setAttachments(editingEvent.attachments);
    }
  }, [editingEvent]);

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-emerald-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-amber-600' },
    { value: 'high', label: 'High Priority', color: 'text-rose-600' }
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
      title: "Files prepared",
      description: `${files.length} file(s) ready for your sacred timeline.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time || !venue.trim()) {
      toast({
        title: "Missing sacred details",
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
      status: editingEvent ? status : 'pending',
      attachments
    });

    toast({
      title: editingEvent ? "Event updated!" : "Event created!",
      description: editingEvent ? "Your event has been updated in your timeline." : "A new moment has been added to your sacred timeline.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-indigo-600" />
            {editingEvent ? 'Update Sacred Event' : 'New Sacred Event'}
          </CardTitle>
          {editingEvent && (
            <p className="text-sm text-gray-600 mt-1">Refining the details of your meaningful moment</p>
          )}
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
                  placeholder="Enter your sacred event title..."
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Priority
                </label>
                <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                  <SelectTrigger className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
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
                placeholder="Describe this meaningful moment..."
                className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
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
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Sacred Space / Venue
              </label>
              <Input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Where will this moment unfold..."
                className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements & Preparations
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add a requirement..."
                  className="flex-1 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                />
                <Button type="button" onClick={handleAddRequirement} variant="outline" className="border-indigo-200 text-indigo-700">
                  Add
                </Button>
              </div>
              {requirements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {requirements.map((req) => (
                    <Badge key={req} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer" onClick={() => handleRemoveRequirement(req)}>
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
                Sacred Notes & Reflections
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your thoughts, intentions, or reminders for this moment..."
                className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                rows={3}
              />
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Sacred Attachments
              </label>
              <div className="border-2 border-dashed border-indigo-200 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors bg-gradient-to-br from-indigo-25 to-purple-25">
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
                  <Paperclip className="w-8 h-8 text-indigo-400" />
                  <span className="text-indigo-700 font-medium">Upload meaningful files</span>
                  <span className="text-xs text-indigo-500">Documents, images, tickets, or any sacred memories</span>
                </label>
              </div>
              {attachments.length > 0 && (
                <div className="mt-3 space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <Paperclip className="w-3 h-3 text-indigo-500" />
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
                className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                {editingEvent ? 'Update Event' : 'Save Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
