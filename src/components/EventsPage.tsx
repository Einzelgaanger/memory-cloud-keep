
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, MapPin, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EventForm from './EventForm';

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
  attachments: string[];
}

const EventsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Doctor Appointment',
      description: 'Annual health checkup with Dr. Smith',
      date: '2024-06-10',
      time: '14:30',
      venue: 'City Medical Center, Room 203',
      requirements: ['Insurance card', 'Previous test results'],
      notes: 'Remember to ask about vitamin D levels',
      priority: 'high',
      attachments: ['insurance_card.pdf']
    }
  ]);

  const handleAddEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: Date.now().toString()
    };
    setEvents([newEvent, ...events]);
    setShowForm(false);
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort events by date and time
  const sortedEvents = filteredEvents.sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeA.getTime() - dateTimeB.getTime();
  });

  if (showForm) {
    return <EventForm onSave={handleAddEvent} onCancel={() => setShowForm(false)} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            My Events
          </h2>
          <p className="text-gray-600 mt-2">Plan and organize your upcoming events and appointments</p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          New Event
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
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

      {/* Events List */}
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {event.title}
                    </CardTitle>
                    <Badge className={getPriorityColor(event.priority)}>
                      {event.priority} priority
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    {event.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Date, Time, and Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{formatTime(event.time)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="font-medium">{event.venue}</span>
                </div>
              </div>

              {/* Requirements */}
              {event.requirements.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {event.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
                      <p className="text-sm text-gray-600">{event.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {event.attachments.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FileText className="w-3 h-3" />
                  <span>{event.attachments.length} attachment{event.attachments.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No events found</h3>
          <p className="text-gray-400 mb-6">Create your first event to start organizing your schedule</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Event
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
