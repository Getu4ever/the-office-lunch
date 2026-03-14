import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, eventNature, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Send the Notification to YOU (info@karoldigital.co.uk)
    await resend.emails.send({
      from: 'The Catering Co <info@karoldigital.co.uk>', 
      to: 'info@karoldigital.co.uk',
      subject: `New Inquiry: ${name} (${eventNature})`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Concierge Inquiry</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      `,
    });

    // 2. Send the Confirmation to the SENDER (the client)
    const { data, error } = await resend.emails.send({
      from: 'The Catering Co <info@karoldigital.co.uk>',
      to: email, // This goes to the person who filled the form
      subject: 'We have received your inquiry | The Catering Co.',
      html: `
        <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 40px; border-radius: 20px; background-color: #ffffff;">
          <h2 style="color: #f06428; text-transform: uppercase; letter-spacing: 2px;">Thank You, ${name}</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            We've received your inquiry regarding your <strong>${eventNature}</strong>. 
            Our concierge team is reviewing the details, and we will get back to you within 24 hours to discuss your bespoke menu.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8;">
              Modern Heritage Cuisine & Bespoke Events<br/>
              &copy; 2026 The Catering Co.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Confirmation Email Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}