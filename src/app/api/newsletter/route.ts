import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Uses your RESEND_NEWSLETTER_KEY from .env.local
const resend = new Resend(process.env.RESEND_NEWSLETTER_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Notify YOU (The one you said is working)
    await resend.emails.send({
      from: 'The Office Lunch <info@karoldigital.co.uk>', 
      to: 'info@karoldigital.co.uk',
      subject: 'New Guestlist Signup',
      html: `<p>A new user has joined your guestlist: <strong>${email}</strong></p>`,
    });

    // 2. Welcome the SUBSCRIBER
    // I simplified the 'from' name and added a more robust sending check
    const { data: subscriberData, error: subscriberError } = await resend.emails.send({
      from: 'The Catering Co <info@karoldigital.co.uk>',
      to: email.trim(), // Added .trim() to prevent hidden space errors
      subject: 'Welcome to The Catering Co. Guestlist',
      html: `
        <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 40px; border-radius: 20px; background-color: #ffffff;">
          <h2 style="color: #f06428; text-transform: uppercase; letter-spacing: 2px;">You're on the list!</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            Thank you for joining our exclusive guestlist. You'll be the first to receive updates on our 
            seasonal menus, upcoming events, and culinary heritage stories.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8;">
              Modern Heritage Cuisine & Bespoke Events<br/>
              &copy; 2026 The Catering Co.
            </p>
          </div>
        </div>
      `,
    });

    if (subscriberError) {
      console.error('Resend failed to email the subscriber:', subscriberError);
      // We still return success:true because YOU got the lead, 
      // but we log the error so you can see why it failed in the terminal.
    }

    return NextResponse.json({ success: true, data: subscriberData });

  } catch (error) {
    console.error('Newsletter Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}