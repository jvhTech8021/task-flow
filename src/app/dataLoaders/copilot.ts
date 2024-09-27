
import { copilotApi } from "copilot-node-sdk";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function initializeCoPilot({
  searchParams,
}: {
  searchParams: any;
}) {

  console.log('Initializing copilot', process.env.COPILOT_API_KEY, searchParams)

  const copilot = copilotApi({
    apiKey: process.env.COPILOT_API_KEY as string,
  });

  return copilot
};
