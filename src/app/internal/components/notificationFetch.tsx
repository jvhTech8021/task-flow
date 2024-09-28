// app/internal/components/TasksFetcher.tsx

'use client';

import { useEffect, useState } from 'react';
import TasksTable from './tasksTable';

interface Notification {
  ClientId: string;
  Name: string;
  Company: any;
  Email: string;
  Status: string;
  Notification: string;
  CreatedAt: string;
  isRead: boolean;
  TimeSinceCreation: string;
  details: string;
  email: string;
}

const TasksFetcher = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/notifications', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      console.log("DATA", data)

      // Compute TimeSinceCreation on the client
      const updatedNotifications = data.notifications.map((notification: Notification) => {
        const createdAt = new Date(notification.CreatedAt);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

        let timeSince = '';
        if (diffInSeconds < 60) {
          timeSince = `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60);
          timeSince = `${minutes} minutes ago`;
        } else if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600);
          timeSince = `${hours} hours ago`;
        } else {
          const days = Math.floor(diffInSeconds / 86400);
          timeSince = `${days} days ago`;
        }

        return { ...notification, TimeSinceCreation: timeSince };
      });

      setNotifications(updatedNotifications);
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Set up polling every 10 minutes (600,000 milliseconds)
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 600000); // 10 minutes

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return <TasksTable notifications={notifications} />;
};

export default TasksFetcher;
