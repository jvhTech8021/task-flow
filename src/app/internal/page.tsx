import TasksFetcher from '@/app/internal/components/notificationFetch';

export default function TaskPage() {

  console.log(process.env.COPILOT_API_KEY)
  return (
    <div className="m-4">
      <TasksFetcher />
      {/* What is this */}
    </div>
  );
}
