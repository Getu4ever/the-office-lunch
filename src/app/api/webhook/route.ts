import { NextResponse } from "next/server";
import { headers } from 'next/headers';
import Stripe from "stripe";
import { Resend } from 'resend';
import dbConnect from "../../../lib/mongodb";
import Order from "../../../models/Order";
import Product from "../../../models/Product";

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

/**
 * HELPER: Ensures images have a valid absolute URL.
 */
const formatImageUrl = (url: any, itemName: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  if (!url || url === "undefined" || url === "null" || url === "") {
    return `https://placehold.co/200x200/b32d3a/white?text=${encodeURIComponent(itemName)}`;
  }
  
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `${baseUrl}${url}`;
  
  return `https://res.cloudinary.com/dahsgprqm/image/upload/${url}`;
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook Signature Verification Failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    await dbConnect();

    try {
      // 1. Parse the COMPRESSED cart details (id and q)
      const compressedCart = JSON.parse(metadata?.cartDetails || "[]");
      
      // 2. RE-HYDRATE: Fetch full details from DB using IDs
      // This ensures the image and name are present even if not in metadata
      const mappedItems = await Promise.all(compressedCart.map(async (item: any) => {
        const product = await Product.findById(item.id);
        const itemName = product?.name || "Menu Item";
        return {
          name: itemName,
          quantity: Number(item.q || 1),
          price: product?.price || 0,
          image: formatImageUrl(product?.image, itemName)
        };
      }));

      // 3. Create Order
      const newOrder = await Order.create({
        orderId: `ORD-${session.id.slice(-8).toUpperCase()}`,
        userEmail: metadata?.userEmail || session.customer_details?.email,
        userName: session.customer_details?.name || "Customer",
        items: mappedItems,
        total: (session.amount_total || 0) / 100,
        status: "paid",
        eventDate: metadata?.eventDate || "TBD",
        deliverySlot: metadata?.deliverySlot || "TBD",
      });

      // 4. Update Product Stock
      for (const item of compressedCart) {
        if (item.id && item.id.length === 24) {
          await Product.findByIdAndUpdate(item.id, { 
            $inc: { stock: -Number(item.q || 1) } 
          });
        }
      }

      // 5. Send the Confirmation Email (Styled as requested)
      await resend.emails.send({
        from: 'The Office Lunch <info@karoldigital.co.uk>',
        to: [newOrder.userEmail],
        replyTo: 'info@karoldigital.co.uk',
        subject: `Order Confirmation - ${newOrder.orderId}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; background-color: #ffffff;">
            
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #b32d3a; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 1px; text-transform: uppercase;">THE OFFICE LUNCH</h1>
              <div style="width: 40px; height: 2px; background-color: #b32d3a; margin: 15px auto;"></div>
              <p style="color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Order Confirmation & Receipt</p>
            </div>

            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 10px;">Thank you for your order!</h2>
              <p style="color: #64748b; font-size: 16px; line-height: 1.5; margin: 0;">We've received your payment and our kitchen team is ready for your event.</p>
            </div>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 40px;">
              <h3 style="color: #b32d3a; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0;">Delivery Details</h3>
              <p style="margin: 0 0 8px 0; font-size: 15px; color: #0f172a;"><strong>Event Date:</strong> ${newOrder.eventDate}</p>
              <p style="margin: 0 0 8px 0; font-size: 15px; color: #0f172a;"><strong>Time Slot:</strong> ${newOrder.deliverySlot}</p>
              <p style="margin: 0; font-size: 15px; color: #94a3b8;"><strong>Order ID:</strong> ${newOrder.orderId}</p>
            </div>

            <div style="margin-bottom: 30px;">
              <table width="100%" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th align="left" style="padding-bottom: 12px; border-bottom: 2px solid #0f172a; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase;">Items</th>
                    <th align="right" style="padding-bottom: 12px; border-bottom: 2px solid #0f172a; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${newOrder.items.map((item: any) => `
                    <tr>
                      <td style="padding: 20px 0; border-bottom: 1px solid #f1f5f9;">
                        <table style="border-collapse: collapse;">
                          <tr>
                            <td width="64" style="vertical-align: top;">
                              <img src="${item.image}" width="56" height="56" style="border-radius: 8px; object-fit: cover; display: block;" alt="${item.name}">
                            </td>
                            <td style="padding-left: 16px;">
                              <p style="margin: 0; font-size: 15px; font-weight: 800; color: #0f172a;">${item.name}</p>
                              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Quantity: ${item.quantity}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td align="right" style="padding: 20px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; font-weight: 800; color: #0f172a; vertical-align: middle;">
                        £${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div style="text-align: right; margin-top: 20px;">
              <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Total Amount Paid</p>
              <p style="margin: 8px 0 0 0; font-size: 42px; font-weight: 900; color: #0f172a; letter-spacing: -1px;">£${newOrder.total.toFixed(2)}</p>
            </div>

            <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; 2026 The Office Lunch • info@karoldigital.co.uk</p>
            </div>
          </div>
        `,
      });

      return NextResponse.json({ success: true });
    } catch (e: any) {
      console.error("❌ Webhook Internal Error:", e.message);
      return NextResponse.json({ error: "Internal processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}