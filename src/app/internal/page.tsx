import TasksTable from "@/app/internal/components/tasksTable";
import { getSession } from '@/utils/session';

export default async function TaskPage({ searchParams }: { searchParams: SearchParams }) {
  const { copilot, data } = await getSession(searchParams);
  console.log("Data", data)
  const clients = await copilot?.listClients({});
  const clientNotificationsMap: any[] = [];

  // Ensure clients and clients.data exist before proceeding
  if (clients?.data?.length) {
    // Use Promise.all to handle asynchronous operations correctly
    await Promise.all(
      clients.data.map(async (client) => {
        const clientNotifications = await copilot?.listNotifications({
          recipientId: client.id,
          includeRead: true,
        });

        if (clientNotifications?.data) {
          clientNotifications.data.forEach(async (notification: any) => {
            clientNotificationsMap.push({
              ClientId: client.id,
              Name: `${client.givenName} ${client.familyName}`,
              Company: await copilot?.retrieveCompany({ id: `${client.companyId }`}),
              Email: client.email,
              Status: client.status,
              Notification: notification.deliveryTargets?.inProduct.title,
              CreatedAt: new Date(notification.createdAt).toLocaleString(),
              isRead: notification.deliveryTargets?.inProduct.isRead,
              TimeSinceCreation: '',
              details: notification.deliveryTargets?.inProduct.body,
              email: notification.deliveryTargets?.email?.body,
            });
          });
        }
      })
    );
  } else {
    console.error('No clients found or clients.data is undefined');
  }

  // console.log("clientNotificationsMap", clientNotificationsMap);

  return (
    <>
      <div className="m-4">
        <TasksTable notifications={clientNotificationsMap}></TasksTable>
      </div>
    </>
  );
}
