// // /pages/api/webhook.js
// let latestEventData = null;

// export default async function webhookHandler(req, res) {
//   if (req.method === 'POST') {
//     // Parse and store the event data
//     latestEventData = req.body; 

//     console.log("webhookHandler()", latestEventData)
    
//     // Respond to acknowledge receipt of the event
//     res.status(200).json({ message: 'Event received' });
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} not allowed`);
//   }
// }

// // Export the latest event data so the /api/events route can access it
// export { latestEventData };

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const body = await request.json();

    // You can now access the event data from the body
    const event = body.event;
    
    // Do something with the event, like logging it or processing it
    console.log("Received event:", event);

    // Prepare a response object
    const response = {
      message: "Event received successfully",
      eventReceived: event,
      timestamp: new Date(),
    };

    // Return a success response
    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    // Handle any errors that occur
    console.error("Error processing event:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to process event" }), { status: 500 });
  }
}
