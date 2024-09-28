import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_DEV || "");

export async function POST(req: NextRequest) {
  try {
    const { toName, toEmail, toCompany, notification, body, createdAt } = await req.json();  // Parse the JSON body of the request
    console.log('to', toName)
    console.log('toEmail', toEmail)
    console.log('toCompanyto', toCompany)
    console.log('notification', notification)
    console.log('body', body)

    const msg = {
      to: "vanhornjoe8@gmail.com", // recipient from request body
      from: 'jvhtechinnovation@gmail.com', // verified sender
      subject: `Windstone Financial Reminder: ${notification}`,
      text: body,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Windstone Dashboard Notification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 20px;
                  color: #000000; /* Black text for high readability */
              }
              .container {
                  max-width: 600px;
                  background-color: #ffffff;
                  margin: auto;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Subtle black shadow */
              }
              .message {
                  font-size: 16px;
                  color: #000000; /* Black message text */
                  line-height: 1.6;
              }
              .button {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 12px 24px;
                  background-color: #ffffff; /* White background */
                  color: #333333; /* Dark text color */
                  text-decoration: none;
                  border: 1px solid #333333; /* Dark thin border */
                  border-radius: 4px;
                  transition: background-color 0.3s ease, color 0.3s ease;
              }
              .button:hover {
                  background-color: #f0f0f0; /* Light gray background on hover */
                  color: #000000; /* Darker text on hover */
              }
              .footer {
                  margin-top: 30px;
                  font-size: 12px;
                  color: #777777;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <p class="message">
                  There is an item waiting for you in your Windstone dashboard:<br><br>
                  ${body}<br><br>
                  <a href="https://portal.windstonefinancial.com/" class="button">Click here to access them</a>
              </p>
              <div class="footer">
                  &copy; 2024 Windstone Financial. All rights reserved.
              </div>
          </div>
      </body>
      </html>
            `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Email failed to send' }, { status: 500 });
  }
}
