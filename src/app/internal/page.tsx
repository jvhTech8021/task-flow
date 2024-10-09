import TasksFetcher from '@/app/internal/components/notificationFetch';

export default function TaskPage() {

  console.log("THIS HERE", process.env.COPILOT_API_KEY)
  return (
    <div className="m-4">
      {process.env.COPILOT_API_KEY}

      <TasksFetcher />
      {/* What is this */}
    </div>
  );
}
