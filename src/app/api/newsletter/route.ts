import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Sends a direct notification to your inbox
    const { data, error } = await resend.emails.send({
      from: 'The Catering Co <onboarding@resend.dev>', 
      to: 'info@karoldigital.co.uk',
      subject: 'New Guestlist Signup',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #f06428;">New Subscriber</h2>
          <p>A new user has joined your guestlist via the website footer.</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Newsletter Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}