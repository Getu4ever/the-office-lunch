import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { cartItems, metadata } = await req.json();
    const origin = req.headers.get('origin') || 'http://localhost:3000'; 

    // Build the line items safely
    const line_items = cartItems.map((item: any) => {
      // STRIPE RULE: Images must be publicly accessible (HTTPS).
      // We only pass the image if it starts with 'http' (Cloudinary/S3).
      // If it's a local path (/menu/suya.jpg), we skip it to prevent the "Not a valid URL" error.
      const hasValidImage = item.image && item.image.startsWith('http');

      const productData: any = {
        name: item.name,
      };

      if (hasValidImage) {
        productData.images = [item.image];
      }

      return {
        price_data: {
          currency: 'gbp',
          product_data: productData,
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      metadata: {
        eventDate: metadata?.eventDate || 'Not specified',
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    // Log the full error to your terminal so you can see exactly what Stripe is complaining about
    console.error('❌ Stripe Checkout Error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}