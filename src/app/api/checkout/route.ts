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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // 1. Prepare Line Items (Stripe uses this for the Checkout Page UI)
    // We keep the images here so the customer SEES the food on the Stripe page.
    const line_items = cartItems.map((item: any) => {
      let imageUrl = item.image || item.img;
      
      // Ensure absolute URL for Stripe
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
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

    // 2. Create the Session with COMPRESSED Metadata
    // We remove 'name' and 'image' from metadata to stay under the 500-character limit.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/menu`,
      customer_email: userEmail || undefined,
      shipping_address_collection: { allowed_countries: ["GB"] },
      metadata: {
        userId: userId || "",
        userEmail: userEmail || "",
        deliverySlot: deliverySlot || "",
        eventDate: selectedDate || "",
        // COMPRESSED: Only ID and Quantity. Webhook will fetch the rest from DB.
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