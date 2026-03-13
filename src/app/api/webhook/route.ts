import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

const resend = new Resend(process.env.RESEND_API_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    
    console.log('✅ 💰 SUCCESS: Payment received for Session:', session.id);

    try {
      // 1. Fetch line items with expanded product data for images
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      const totalAmount = (session.amount_total || 0) / 100;

      // 2. Generate the refined HTML for items
      const itemsHtml = lineItems.data.map(item => {
        const product = item.price?.product as Stripe.Product;
        const imageUrl = product.images?.[0] || '';

        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center;">
              ${imageUrl ? `
                <div style="margin-right: 16px; flex-shrink: 0;">
                  <img src="${imageUrl}" alt="${item.description}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 12px; border: 1px solid #f1f5f9;" />
                </div>
              ` : ''}
              <div>
                <p style="margin: 0; font-weight: 700; color: #0f172a; font-size: 15px; line-height: 1.2;">
                  ${item.description}
                </p>
                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px; font-weight: 500;">
                  Quantity: ${item.quantity}
                </p>
              </div>
            </div>
            
            <div style="margin-left: 20px; white-space: nowrap; font-weight: 800; color: #0f172a; font-size: 15px;">
              &nbsp; £${((item.amount_total || 0) / 100).toFixed(2)}
            </div>
          </div>
        `;
      }).join('');

      // EMAIL 1: Notification to YOU
      await resend.emails.send({
        from: 'The Catering Co. <info@karoldigital.co.uk>',
        to: 'info@karoldigital.co.uk',
        subject: `New Order Received - £${totalAmount.toFixed(2)}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
            <h2 style="color: #f06428; text-transform: uppercase; letter-spacing: 0.1em;">New Order Detail</h2>
            <p><strong>Customer:</strong> ${customerEmail}</p>
            <p><strong>Event Date:</strong> ${session.metadata?.eventDate || 'Not specified'}</p>
            <div style="margin-top: 20px;">
              ${itemsHtml}
            </div>
            <p style="font-size: 20px; margin-top: 20px; text-align: right;"><strong>Total Paid: £${totalAmount.toFixed(2)}</strong></p>
          </div>
        `
      });

      // EMAIL 2: Confirmation to the CUSTOMER
      if (customerEmail) {
        await resend.emails.send({
          from: 'The Catering Co. <info@karoldigital.co.uk>',
          to: customerEmail,
          subject: 'We have received your order! - The Catering Co.',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #f1f5f9; border-radius: 32px; color: #1e293b;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #f06428; font-size: 32px; margin-bottom: 8px; font-weight: 900; text-transform: uppercase;">Thank You!</h1>
                <p style="color: #64748b; margin: 0; font-size: 16px;">We've received your payment and our kitchen is getting ready.</p>
              </div>
              
              <div style="background-color: #f8fafc; padding: 24px; border-radius: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;">Order Summary</h3>
                ${itemsHtml}
                <div style="margin-top: 24px; text-align: right;">
                  <p style="font-size: 22px; font-weight: 900; margin: 0; color: #0f172a;">Total Paid: £${totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div style="margin-bottom: 32px; font-size: 14px; padding: 0 8px;">
                <p style="margin: 8px 0;"><strong>Event Date:</strong> ${session.metadata?.eventDate || 'Not specified'}</p>
                <p style="color: #64748b;">Order ID: ${session.id}</p>
              </div>
              
              <p style="font-size: 14px; color: #64748b; text-align: center;">If you have any questions, simply reply to this email or call us at 020 7123 4567.</p>
              
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
              <p style="text-align: center; color: #cbd5e1; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em;">
                The Catering Co. | Caribbean & African Catering
              </p>
            </div>
          `,
        });
        console.log(`📧 Customer receipt sent to: ${customerEmail}`);
      }

    } catch (error) {
      console.error('❌ Failed to process order emails:', error);
    }
  }

  return NextResponse.json({ received: true });
}