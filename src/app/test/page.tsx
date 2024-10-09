import TasksFetcher from '@/app/internal/components/notificationFetch';
import { CopilotAPI } from "@/utils/sessionTest";


export default async function TaskPage() {

  console.log("THIS HERE", process.env.COPILOT_API_KEY)
  const copilot = new CopilotAPI("token");
  const clients = await copilot.getClients();
  console.log('clients', clients)
  return (
    <div className="m-4">
      {/* <TasksFetcher /> */}
    </div>
  );
}
