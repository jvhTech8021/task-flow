import TasksFetcher from '@/app/internal/components/notificationFetch';

export default function TaskPage({ searchParams }: { searchParams: SearchParams }) {

  console.log("THIS HERE", process.env.COPILOT_API_KEY)

  return (
    <div className="m-4">
      <TasksFetcher searchParams={searchParams}/>
    </div>
  );
}
