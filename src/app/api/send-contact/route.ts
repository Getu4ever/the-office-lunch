import { Resend } from 'resend';
import { NextResponse } from 'next/server';

/**
 * Note: While the API key is provided here directly, it is highly recommended 
 * to store this in your .env file as RESEND_API_KEY for security.
 */
const resend = new Resend('re_5gU7yEE1_nZoQYaT5vtQBoqtwexhwhu1k');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, eventNature, message } = body;

    // Validate that we have the required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'The Catering Co <onboarding@resend.dev>', 
      to: 'info@karoldigital.co.uk',
      subject: `New Inquiry: ${name} (${eventNature})`,
      replyTo: email, // Corrected to camelCase for TypeScript compliance
      html: `
        <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 40px; border-radius: 20px; background-color: #ffffff;">
          <h2 style="color: #f06428; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">New Concierge Inquiry</h2>
          <p style="font-size: 14px; color: #94a3b8; margin-bottom: 30px;">Received via the Contact Page</p>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 15px; border: 1px solid #f1f5f9;">
            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-weight: bold; text-transform: uppercase; font-size: 10px; color: #f06428; letter-spacing: 1.5px;">Client Name</p>
              <p style="margin: 5px 0; font-size: 16px; color: #0f172a; font-weight: 600;">${name}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-weight: bold; text-transform: uppercase; font-size: 10px; color: #f06428; letter-spacing: 1.5px;">Client Email</p>
              <p style="margin: 5px 0; font-size: 16px; color: #0f172a;">${email}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-weight: bold; text-transform: uppercase; font-size: 10px; color: #f06428; letter-spacing: 1.5px;">Nature of Event</p>
              <p style="margin: 5px 0; font-size: 16px; color: #0f172a;">${eventNature}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-weight: bold; text-transform: uppercase; font-size: 10px; color: #f06428; letter-spacing: 1.5px;">Message Details</p>
              <p style="margin: 10px 0; font-size: 16px; line-height: 1.6; color: #334155; font-style: italic;">"${message}"</p>
            </div>
          </div>
          
          <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8;">
            &copy; 2026 The Catering Co. Modern Heritage Cuisine.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}