import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Updated to use your specific Booking Key
const resend = new Resend(process.env.RESEND_BOOKING_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Added 'email' and 'name' here so we can reply to the client
    const { eventType, guestCount, date, vision, email, name } = body;

    // 1. Send the internal alert to YOU
    await resend.emails.send({
      from: 'The Catering Co <info@karoldigital.co.uk>',
      to: 'info@karoldigital.co.uk',
      subject: `New Event Inquiry: ${eventType}`,
      html: `
        <div style="font-family: sans-serif; padding: 40px; background-color: #0f172a; color: white; border-radius: 20px;">
          <h1 style="color: #f06428; text-transform: uppercase; letter-spacing: 2px;">New Inquiry</h1>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
          <p style="font-size: 16px;"><strong>Client:</strong> ${name || 'Interested Guest'}</p>
          <p style="font-size: 16px;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 16px;"><strong>Experience:</strong> ${eventType}</p>
          <p style="font-size: 16px;"><strong>Guests:</strong> ${guestCount}</p>
          <p style="font-size: 16px;"><strong>Proposed Date:</strong> ${date}</p>
          <p style="font-size: 16px; color: rgba(255,255,255,0.6);"><strong>Vision:</strong> ${vision || 'No specific notes provided.'}</p>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
          <p style="font-size: 12px; opacity: 0.5;">Sent via The Catering Co. Booking System</p>
        </div>
      `,
    });

    // 2. Send the confirmation to the CLIENT
    const { data, error } = await resend.emails.send({
      from: 'The Catering Co <info@karoldigital.co.uk>',
      to: email,
      subject: 'Booking Request Received | The Catering Co.',
      html: `
        <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 40px; border-radius: 20px;">
          <h2 style="color: #f06428; text-transform: uppercase;">Inquiry Confirmed</h2>
          <p>Thank you for choosing The Catering Co. We have received your request for a <strong>${eventType}</strong> on <strong>${date}</strong>.</p>
          <p>Our events team will review your vision and contact you shortly to discuss the menu curation.</p>
          <div style="margin-top: 30px; border-top: 1px solid #eee; pt-20px;">
            <p style="font-size: 12px; color: #94a3b8;">Modern Heritage Cuisine &copy; 2026</p>
          </div>
        </div>
      `
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