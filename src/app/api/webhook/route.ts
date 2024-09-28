import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = body.event;
    
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
