import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

interface Event {
  id: number;
  name: string;
  date: Date;
  sectionId: number | null;
}

interface EventsTabProps {
  selectedSection: { id: number; name: string } | null;
}

export default function EventsTab({ selectedSection }: EventsTabProps) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      name: "Parent-Teacher Meeting",
      date: new Date(2024, 9, 15),
      sectionId: null,
    },
    {
      id: 2,
      name: "Annual Sports Day",
      date: new Date(2024, 9, 22),
      sectionId: null,
    },
    {
      id: 3,
      name: "Science Fair",
      date: new Date(2024, 10, 5),
      sectionId: null,
    },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [markedDates, setMarkedDates] = useState<
    Record<string, { marked: boolean }>
  >({});

  useEffect(() => {
    const newMarkedDates: Record<string, { marked: boolean }> = {};
    events.forEach((event) => {
      const dateString = format(event.date, "yyyy-MM-dd");
      newMarkedDates[dateString] = { marked: true };
    });
    setMarkedDates(newMarkedDates);
  }, [events]);

  const filteredEvents = selectedSection
    ? events.filter(
        (event) =>
          event.sectionId === selectedSection.id || event.sectionId === null
      )
    : events;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const eventsOnSelectedDate = filteredEvents.filter(
        (event) => event.date.toDateString() === date.toDateString()
      );
      if (eventsOnSelectedDate.length === 0) {
        setIsAddEventDialogOpen(true);
      }
    }
  };

  const handleAddEvent = () => {
    if (selectedDate && newEventName) {
      const newEvent: Event = {
        id: events.length + 1,
        name: newEventName,
        date: selectedDate,
        sectionId: selectedSection ? selectedSection.id : null,
      };
      setEvents([...events, newEvent]);
      setNewEventName("");
      setIsAddEventDialogOpen(false);

      // Update marked dates
      const dateString = format(selectedDate, "yyyy-MM-dd");
      setMarkedDates((prev) => ({
        ...prev,
        [dateString]: { marked: true },
      }));
    }
  };

  const handleDeleteEvent = (id: number) => {
    const eventToDelete = events.find((event) => event.id === id);
    setEvents(events.filter((event) => event.id !== id));

    // Update marked dates if there are no more events on this date
    if (eventToDelete) {
      const dateString = format(eventToDelete.date, "yyyy-MM-dd");
      const remainingEventsOnDate = events.filter(
        (event) =>
          event.id !== id && format(event.date, "yyyy-MM-dd") === dateString
      );
      if (remainingEventsOnDate.length === 0) {
        setMarkedDates((prev) => {
          const newMarkedDates = { ...prev };
          delete newMarkedDates[dateString];
          return newMarkedDates;
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedSection
            ? `Events for ${selectedSection.name}`
            : "All Upcoming Events"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            // modifiers={{ markedDates: markedDates }}
            modifiersStyles={{
              marked: {
                backgroundColor: "hsl(var(--primary))",
                color: "white",
              },
            }}
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Event List</h3>
          <ul className="space-y-2">
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <motion.li
                  key={event.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-between items-center p-2 bg-muted rounded-md"
                >
                  <span>{event.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {format(event.date, "MMMM d, yyyy")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </CardContent>

      <Dialog
        open={isAddEventDialogOpen}
        onOpenChange={setIsAddEventDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                placeholder="Enter event name"
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                value={selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
                disabled
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddEvent} disabled={!newEventName}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
