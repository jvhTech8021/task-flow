
import { copilotApi } from "copilot-node-sdk";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function initializeCoPilot({
  searchParams,
}: {
  searchParams: any;
}) {

  const copilot = copilotApi({
	  apiKey: `${process.env.COPILOT_API_KEY}`,
  });

//   const test = await copilot.listClients({})
//   console.log('test', test)

  return copilot
};
