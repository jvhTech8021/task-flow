// /pages/api/webhook.js
let latestEventData = null;

export default async function webhookHandler(req, res) {
  if (req.method === 'POST') {
    // Parse and store the event data
    latestEventData = req.body; 

    console.log("webhookHandler()", latestEventData)
    
    // Respond to acknowledge receipt of the event
    res.status(200).json({ message: 'Event received' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}

// Export the latest event data so the /api/events route can access it
export { latestEventData };
