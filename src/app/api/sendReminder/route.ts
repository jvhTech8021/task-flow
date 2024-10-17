import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_DEV || "");

export async function POST(req: NextRequest) {
    try {
        const { toName, toEmail, toCompany, Notification, NotificationEmailBody, TimeSinceCreation, CreatedAt, priority, note } = await req.json();  // Parse the JSON body of the request
        console.log('to', toName)
        console.log('toEmail', toEmail)
        console.log('toCompanyto', toCompany)
        console.log('notification', Notification)
        console.log('body', NotificationEmailBody)
        console.log('priority', priority)
        console.log('note', note)

        const msg = {
            // to: "cevbalen@gmail.com", 
            to: toEmail,
            from: 'notification@windstonefinancial.com',
            subject: `Windstone Financial Reminder: ${Notification}`,
            text: NotificationEmailBody,
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
              color: #000000;
          }
          .container {
              max-width: 600px;
              background-color: #ffffff;
              margin: auto;
              padding: 30px;
              border-radius: 8px;
              border-left: 8px solid ${priority === 'high' ? '#ff4d4f' : priority === 'medium' ? '#ffec3d' : '#52c41a'};
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .priority {
              display: flex;
              align-items: center;
              font-weight: bold;
              font-size: 14px;
              color: ${priority === 'high' ? '#ff4d4f' : priority === 'mediun' ? '#faad14' : '#52c41a'};
              margin-bottom: 10px;
          }
          .priority-icon {
              display: inline-block;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background-color: ${priority === 'high' ? '#ffccc7' : priority === 'medium' ? '#fff1b8' : '#d9f7be'};
              color: ${priority === 'high' ? '#ff4d4f' : priority === 'medium' ? '#faad14' : '#389e0d'};
              text-align: center;
              line-height: 18px;
              font-weight: bold;
              margin-right: 8px;
          }
          .message {
              font-size: 16px;
              color: #595959;
              line-height: 1.6;
          }
          .button {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              background-color: #ffffff;
              color: #333333;
              text-decoration: none;
              border: 1px solid #333333;
              border-radius: 4px;
              transition: background-color 0.3s ease, color 0.3s ease;
          }
          .button:hover {
              background-color: #f0f0f0;
              color: #000000;
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
          <div class="priority">
              <span class="priority-icon">!</span> ${priority === 'high' ? 'High Priority' : priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
          </div>
          <p class="message">
              ${note ? note : ""}<br><br>
              There is an item waiting for you in your Windstone dashboard that was created ${TimeSinceCreation}:<br><br>
              ${NotificationEmailBody}<br><br>
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

        const health = {
            to: "vanhornjoe8@gmail.com", // recipient from request body
            from: 'notification@windstonefinancial.com', // verified sender
            subject: `Windstone Financial Reminder: ${Notification}`,
            text: NotificationEmailBody,
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
              color: #000000;
          }
          .container {
              max-width: 600px;
              background-color: #ffffff;
              margin: auto;
              padding: 30px;
              border-radius: 8px;
              border-left: 8px solid ${priority === 'high' ? '#ff4d4f' : priority === 'medium' ? '#ffec3d' : '#52c41a'};
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .priority {
              display: flex;
              align-items: center;
              font-weight: bold;
              font-size: 14px;
              color: ${priority === 'high' ? '#ff4d4f' : priority === 'mediun' ? '#faad14' : '#52c41a'};
              margin-bottom: 10px;
          }
          .priority-icon {
              display: inline-block;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background-color: ${priority === 'high' ? '#ffccc7' : priority === 'medium' ? '#fff1b8' : '#d9f7be'};
              color: ${priority === 'high' ? '#ff4d4f' : priority === 'medium' ? '#faad14' : '#389e0d'};
              text-align: center;
              line-height: 18px;
              font-weight: bold;
              margin-right: 8px;
          }
          .message {
              font-size: 16px;
              color: #595959;
              line-height: 1.6;
          }
          .button {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              background-color: #ffffff;
              color: #333333;
              text-decoration: none;
              border: 1px solid #333333;
              border-radius: 4px;
              transition: background-color 0.3s ease, color 0.3s ease;
          }
          .button:hover {
              background-color: #f0f0f0;
              color: #000000;
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
          <div class="priority">
              <span class="priority-icon">!</span> ${priority === 'high' ? 'High Priority' : priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
          </div>
          <p class="message">
              ${note ? note : ""}<br><br>
              There is an item waiting for you in your Windstone dashboard ${TimeSinceCreation}:<br><br>
              ${NotificationEmailBody}<br><br>
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



        await sgMail.send(health)
        await sgMail.send(msg);

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error: any) {
        // console.error('Error sending email:', JSON.stringify(error));
        if (error.response && error.response.data && error.response.data.errors) {
            console.error("Detailed errors:", error.response.data.errors);
        } else {
            console.error("No error details available.");
        }
        return NextResponse.json({ message: 'Email failed to send' }, { status: 500 });
    }
}
