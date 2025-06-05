import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, MapPin, Clock, FileText, CheckCircle2, CalendarDays, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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
  status: 'pending' | 'completed' | 'rescheduled';
  attachments: string[];
  created_at: string;
  updated_at: string;
}

const EventsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error loading events",
          description: "Failed to load your events. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Type cast the data to ensure proper types
      const typedEvents: Event[] = (data || []).map(event => ({
        ...event,
        priority: event.priority as 'low' | 'medium' | 'high',
        status: event.status as 'pending' | 'completed' | 'rescheduled',
        requirements: event.requirements || [],
        attachments: event.attachments || []
      }));

      setEvents(typedEvents);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding event:', error);
        toast({
          title: "Error creating event",
          description: "Failed to create your event. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const typedEvent: Event = {
        ...data,
        priority: data.priority as 'low' | 'medium' | 'high',
        status: data.status as 'pending' | 'completed' | 'rescheduled',
        requirements: data.requirements || [],
        attachments: data.attachments || []
      };

      setEvents([typedEvent, ...events]);
      setShowForm(false);
      toast({
        title: "Event created!",
        description: "Your event has been saved to your sacred timeline.",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingEvent) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingEvent.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        toast({
          title: "Error updating event",
          description: "Failed to update your event. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const typedEvent: Event = {
        ...data,
        priority: data.priority as 'low' | 'medium' | 'high',
        status: data.status as 'pending' | 'completed' | 'rescheduled',
        requirements: data.requirements || [],
        attachments: data.attachments || []
      };

      setEvents(events.map(event => event.id === editingEvent.id ? typedEvent : event));
      setShowForm(false);
      setEditingEvent(null);
      toast({
        title: "Event updated!",
        description: "Your event has been successfully updated.",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleMarkDone = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) {
        console.error('Error marking event as done:', error);
        return;
      }

      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, status: 'completed' as const }
          : event
      ));

      toast({
        title: "Event completed!",
        description: "Another meaningful moment captured in time.",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReschedule = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      high: 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      rescheduled: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort events: pending events first by date/time, then completed events
  const sortedEvents = filteredEvents.sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeA.getTime() - dateTimeB.getTime();
  });

  if (showForm) {
    return (
      <EventForm 
        onSave={editingEvent ? handleUpdateEvent : handleAddEvent}
        onCancel={() => {
          setShowForm(false);
          setEditingEvent(null);
        }}
        editingEvent={editingEvent}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-indigo-600" />
            Life's Sacred Events
          </h2>
          <p className="text-gray-600 mt-2">Plan and cherish your meaningful moments in time</p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
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
            placeholder="Search your events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <Card key={event.id} className={`hover:shadow-lg transition-all duration-200 border-l-4 bg-white ${
            event.status === 'completed' ? 'border-l-emerald-500 opacity-75' : 'border-l-indigo-500'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className={`text-xl font-semibold ${
                      event.status === 'completed' ? 'text-gray-600 line-through' : 'text-gray-900'
                    }`}>
                      {event.title}
                    </CardTitle>
                    <Badge className={getPriorityColor(event.priority)}>
                      {event.priority} priority
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    {event.description}
                  </CardDescription>
                </div>
                
                {event.status !== 'completed' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleMarkDone(event.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark Done
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReschedule(event)}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Reschedule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Date, Time, and Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">{formatTime(event.time)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span className="font-medium">{event.venue}</span>
                </div>
              </div>

              {/* Requirements */}
              {event.requirements.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {event.notes && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-indigo-500 mt-0.5" />
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
          <p className="text-gray-400 mb-6">Begin your journey by creating your first meaningful event</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
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
