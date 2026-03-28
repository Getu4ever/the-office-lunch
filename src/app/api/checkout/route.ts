import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function POST(req: Request) {
  try {
    await dbConnect(); 
    const body = await req.json();
    const { cartItems, userEmail, userId, deliverySlot, selectedDate } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Basket is empty" }, { status: 400 });
    }

    /**
     * DYNAMIC BASE URL LOGIC
     * 1. Check the 'origin' header (works for localhost and Vercel automatically)
     * 2. Fallback to your hardcoded Vercel URL
     * 3. Final fallback to localhost for safety
     */
    const origin = req.headers.get("origin");
    const baseUrl = origin || "https://the-office-lunch.vercel.app";

    // 1. Prepare Line Items
    const line_items = cartItems.map((item: any) => {
      let imageUrl = item.image || item.img;
      
      if (imageUrl && !imageUrl.startsWith('http')) {
        const formattedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        imageUrl = `${baseUrl}${formattedPath}`;
      }

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: Number(item.quantity || item.qty),
      };
    });

    // 2. Create the Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      // Stripe will now redirect back to exactly where the user came from
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/menus`, 
      customer_email: userEmail || undefined,
      shipping_address_collection: { allowed_countries: ["GB"] },
      metadata: {
        userId: userId || "",
        userEmail: userEmail || "",
        deliverySlot: deliverySlot || "",
        eventDate: selectedDate || "",
        cartDetails: JSON.stringify(cartItems.map((i: any) => ({
          id: i._id || i.id,
          q: Number(i.quantity || i.qty)
        })))
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Checkout Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}