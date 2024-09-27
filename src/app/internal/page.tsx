import TasksTable from "@/app/internal/components/tasksTable";
import initializeCoPilot from "@/app/dataLoaders/copilot";

export default async function TaskPage() {
  const copilot = await initializeCoPilot({ searchParams: "" });
  const clients = await copilot.listClients({});
  const clientNotificationsMap = [];

  // console.log('clients', clients)

  // Use Promise.all to handle asynchronous operations correctly
  await Promise.all(
    clients.data.map(async (client) => {
      const clientNotifications = await copilot.listNotifications({
        recipientId: client.id,
        includeRead: true,
      });

      clientNotifications.data.forEach( async (notification: any) => {
        // console.log('notification', notification)
        clientNotificationsMap.push({
          ClientId: client.id,
          Name: `${client.givenName} ${client.familyName}`,
          Company: await copilot.retrieveCompany({id: client.companyId}),
          Email: client.email,
          Status: client.status,
          Notification: notification.deliveryTargets?.inProduct.title,
          CreatedAt: new Date(notification.createdAt).toLocaleString(),
          isRead: notification.deliveryTargets?.inProduct.isRead,
          TimeSinceCreation: '',
          details: notification.deliveryTargets?.inProduct.body,
          email: notification.deliveryTargets?.email?.body
        });
      });
    })
  );

  // console.log("clientNotificationsMap", clientNotificationsMap);

  return (
    <>
      <div className="m-4">
        <TasksTable notifications={clientNotificationsMap}></TasksTable>
      </div>
    </>
  );
}
