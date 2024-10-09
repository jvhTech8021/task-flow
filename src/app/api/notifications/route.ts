// app/api/tasks/route.ts

import { NextResponse } from 'next/server';
import { getSession } from '@/utils/session';

// In-memory cache
let cachedNotifications: any[] = [];
let lastUpdated: any = null;

// Set cache expiration time (e.g., 5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());

    const { data, copilot } = await getSession(searchParams);

    if (!copilot) {
      return NextResponse.json({ error: 'Copilot not available' }, { status: 500 });
    }

    // Check if cached data is available and still valid
    const now = new Date().getTime();
    if (cachedNotifications.length && lastUpdated && now - lastUpdated < CACHE_EXPIRATION) {
      // Return cached notifications first
      NextResponse.json({ notifications: cachedNotifications });

      // Then proceed to fetch fresh data in the background
      // await fetchFreshData(copilot);

      // Return the cached data immediately
      return NextResponse.json({ notifications: cachedNotifications });
    }

    // No cache or expired cache: Fetch fresh data immediately
    const clientNotificationsMap = await fetchFreshData(copilot);

    return NextResponse.json({ notifications: clientNotificationsMap });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Function to fetch fresh data
async function fetchFreshData(copilot: any) {
  console.time('fetchFreshData'); // Start the timer

  try {
    const clients = await copilot.listClients({});
    const clientNotificationsMap: any[] = [];

    if (clients?.data?.length) {
      console.log('Total clients:', clients.data.length);

      // Process clients in chunks of 2
      for (let i = 0; i < clients.data.length; i += 2) {
        const clientPair = clients.data.slice(i, i + 2);

        // Process the two clients in parallel
        const promises = clientPair.map(async (client: any) => {
          try {
            const [clientNotifications, company] = await Promise.all([
              copilot.listNotifications({
                recipientId: client.id,
                includeRead: true,
              }),
              copilot.retrieveCompany({ id: client.companyId }),
            ]);

            const notificationCount = clientNotifications?.data?.length || 0;

            // Skip this client if they have no notifications
            if (notificationCount === 0) return;

            console.log("Notifications for client", client.id, ":", notificationCount);

            for (const notification of clientNotifications.data) {
              clientNotificationsMap.push({
                ClientId: client.id,
                Name: `${client.givenName ?? ''} ${client.familyName ?? ''}`,
                Email: client.email ?? 'N/A',
                Company: company,
                Status: client.status ?? 'Unknown',
                Notification: notification.deliveryTargets?.inProduct?.title ?? 'N/A',
                CreatedAt: new Date(notification.createdAt).toLocaleString(),
                isRead: notification.deliveryTargets?.inProduct?.isRead ?? false,
                TimeSinceCreation: calculateTimeSince(notification.createdAt),
                details: notification.deliveryTargets?.inProduct?.body ?? '',
                NotificationEmailBody: notification.deliveryTargets?.email?.body ?? '',
              });
            }
          } catch (error) {
            console.error(`Error processing client ${client.id}:`, error);
          }
        });

        // Wait for both client promises to complete before proceeding to the next pair
        await Promise.all(promises);

        // Delay for 1 second after each batch of clients
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Update cache and timestamp
    cachedNotifications = clientNotificationsMap;
    lastUpdated = new Date().getTime();

    return clientNotificationsMap;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Optional: rethrow or handle as needed
  } finally {
    console.timeEnd('fetchFreshData'); // End the timer and log the duration
  }
}

// Helper function to calculate time since creation
function calculateTimeSince(createdAt: string): string {
  const timeDiff = Date.now() - new Date(createdAt).getTime();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  return `${hours} hours ago`; // Customize as needed
}



