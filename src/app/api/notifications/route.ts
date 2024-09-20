import { NextRequest } from "next/server";

// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//       const { message, eventData } = req.body;
//       console.log('Data from Lambda:', message, eventData);
  
//       // Process the data and potentially update your UI
//       res.status(200).json({ success: true });
//     } else {
//       res.status(405).json({ message: 'Method Not Allowed' });
//     }
//   }

  export async function POST(request: NextRequest) {
    const params = request;
    console.log
  }