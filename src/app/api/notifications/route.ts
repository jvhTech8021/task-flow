// app/api/tasks/route.ts

import { NextResponse } from 'next/server';
import { getSession } from '@/utils/session';

// In-memory cache
let cachedNotifications: any[] = [];
let lastUpdated = null;

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
      fetchFreshData(copilot);

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
async function fetchFreshData(copilot) {
  const clients = await copilot.listClients({});
  const clientNotificationsMap: any[] = [];

  if (clients?.data?.length) {
    const BATCH_SIZE = 5;

    for (let i = 0; i < clients.data.length; i += BATCH_SIZE) {
      const batch = clients.data.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (client) => {
          const clientNotifications = await copilot.listNotifications({
            recipientId: client.id,
            includeRead: true,
          });

          if (clientNotifications?.data) {
            for (const notification of clientNotifications.data) {
              clientNotificationsMap.push({
                ClientId: client.id,
                Name: `${client.givenName} ${client.familyName}`,
                Email: client.email,
                Company: await copilot.retrieveCompany({ id: client.companyId }),
                Status: client.status,
                Notification: notification.deliveryTargets?.inProduct.title,
                CreatedAt: new Date(notification.createdAt).toLocaleString(),
                isRead: notification.deliveryTargets?.inProduct.isRead,
                TimeSinceCreation: '', // To be computed on the client
                details: notification.deliveryTargets?.inProduct.body,
                email: notification.deliveryTargets?.email?.body,
              });
            }
          }
        })
      );

      // Optional: Add a delay between each batch to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay between batches
    }
  }

  // Update cache
  cachedNotifications = clientNotificationsMap;
  lastUpdated = new Date().getTime();

  return clientNotificationsMap;
}
