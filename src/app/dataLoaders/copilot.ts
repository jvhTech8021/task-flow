
import { copilotApi } from "copilot-node-sdk";
import { useRouter } from "next/router";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function initializeCoPilot({
  searchParams,
}: {
  searchParams: any;
}) {

  const router = useRouter();
  console.log('router', router)

  console.log('Initializing copilot', process.env.COPILOT_API_KEY, searchParams)

  const copilot = copilotApi({
    apiKey: process.env.COPILOT_API_KEY as string,
  });

  return copilot
};
