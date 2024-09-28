// /pages/api/events.js
import { latestEventData } from './webhook';

export default async function getLatestEvent(req, res) {
  if (req.method === 'GET') {
    // Return the latest event data (if available)
    if (latestEventData) {
      res.status(200).json(latestEventData);
    } else {
      res.status(204).json({ message: 'No event data available' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
