import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { cartItems, metadata } = await req.json();
    const origin = req.headers.get('origin') || 'http://localhost:3000'; 

    // Build the line items
    const line_items = cartItems.map((item: any) => {
      const productData: any = {
        name: item.name,
      };

      if (item.image) {
        /**
         * IMAGE LOGIC:
         * 1. If the image is an external link (starts with 'http'), use it directly.
         * 2. If it's a local path (starts with '/'), prepend the Vercel Base URL.
         * 3. This ensures Stripe always receives a valid public HTTPS URL.
         */
        const imageUrl = item.image.startsWith('http')
          ? item.image
          : `${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`;
        
        productData.images = [imageUrl];
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
      cancel_url: `${origin}/shop`, // Returning to shop makes for a better user experience
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('❌ Stripe Checkout Error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}