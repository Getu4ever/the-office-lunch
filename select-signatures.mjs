import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function selectSignatures() {
  try {
    console.log("⏳ Connecting to DB to tag Signatures...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false, collection: 'products' }));

    // 1. Reset all home selections first to ensure a clean slate
    await Product.updateMany({}, { $unset: { homeTab: "" } });

    // 2. Define the 16 items (4 per category as requested)
    const selections = {
      "Platters": ["Sandwich Platter Meat", "Wrap Platter Mixture", "Bagel Platter", "Mini Wrap Platter"],
      "Lunch Boxes": ["Chicken Tikka Meal Box", "Vegetarian Meal Box", "Salmon Fillet Box", "Executive Lunch Box"],
      "Salads": ["Californian Super Salad", "Green Power Salad", "Greek Salad Platter", "Pasta Salad Platter"],
      "Breakfast": ["Morning Danish Collection", "Savoury Croissants Platter", "Fresh Fruit Skewers", "Breakfast Bagel Platter"],
      "Desserts": ["Macaron Platter", "Brownie Bites", "Cookie Monster Platter", "Mini Cake Selection"]
    };

    console.log("🚀 Tagging 16 items for the Homepage Signature Selection...");

    for (const [tab, names] of Object.entries(selections)) {
      const res = await Product.updateMany(
        { name: { $in: names } },
        { $set: { homeTab: tab } }
      );
      console.log(`✅ ${tab}: Tagged ${res.modifiedCount} items`);
    }

    const totalTagged = await Product.countDocuments({ homeTab: { $exists: true } });
    console.log(`\n🏁 SUCCESS! Total items ready for Homepage: ${totalTagged}`);

  } catch (err) {
    console.error("❌ ERROR:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

selectSignatures();
