import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventType, guestCount, date, vision } = body;

    const { data, error } = await resend.emails.send({
      // While in "Testing" mode, Resend requires 'onboarding@resend.dev' as the sender
      from: 'The Catering Co <onboarding@resend.dev>',
      to: 'info@karoldigital.co.uk',
      subject: `New Event Inquiry: ${eventType}`,
      html: `
        <div style="font-family: sans-serif; padding: 40px; background-color: #0f172a; color: white; border-radius: 20px;">
          <h1 style="color: #f06428; text-transform: uppercase; letter-spacing: 2px;">New Inquiry</h1>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
          <p style="font-size: 16px;"><strong>Experience:</strong> ${eventType}</p>
          <p style="font-size: 16px;"><strong>Guests:</strong> ${guestCount}</p>
          <p style="font-size: 16px;"><strong>Proposed Date:</strong> ${date}</p>
          <p style="font-size: 16px; color: rgba(255,255,255,0.6);"><strong>Vision:</strong> ${vision || 'No specific notes provided.'}</p>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
          <p style="font-size: 12px; opacity: 0.5;">Sent via The Catering Co. Booking System</p>
        </div>
      `,
    });

    if (error) {
      console.error('RESEND ERROR:', error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SERVER ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}