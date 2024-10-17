import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Send } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  time: string;
}

export default function NotificationsTab(prop: any) {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "New student registration", time: "2 hours ago" },
    { id: 2, message: "Teacher absence report", time: "1 day ago" },
    { id: 3, message: "Upcoming parent-teacher meeting", time: "3 days ago" },
  ]);
  const [newNotification, setNewNotification] = useState("");

  const handleSendNotification = () => {
    if (newNotification.trim()) {
      const newNotificationObj: Notification = {
        id: notifications.length + 1,
        message: newNotification,
        time: "Just now",
      };
      setNotifications([newNotificationObj, ...notifications]);
      setNewNotification("");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send New Notification</CardTitle>
          <CardDescription>
            Create and send a new notification to all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your notification here..."
            value={newNotification}
            onChange={(e) => setNewNotification(e.target.value)}
            rows={4}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSendNotification}>
            <Send className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-4 p-4 bg-muted rounded-lg mb-4"
              >
                <Bell className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
