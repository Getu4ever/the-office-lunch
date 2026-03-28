import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function fixCategories() {
  try {
    console.log("⏳ Connecting to DB...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
      category: String
    }, { collection: 'products' }));

    // 1. Get all unique categories currently in your DB
    const distinctCats = await Product.distinct('category');
    console.log("🔍 Found these categories in DB:", distinctCats);

    // 2. MAPPING: Force the DB strings to match your Menu UI Buttons
    const mapping = {
      'Salads': 'Salad',
      'salad': 'Salad',
      'Desserts': 'Deserts',
      'desserts': 'Deserts',
      'Dessert': 'Deserts',
      'Essentials': 'Plate, cutlery and napkins',
      'Cutlery': 'Plate, cutlery and napkins',
      'Cold Drinks': 'Drinks',
      'drinks': 'Drinks',
      'Sandwich Platter': 'Sandwich Platters',
      'Wrap Platter': 'Wrap Platters',
      'Boxes': 'Individual Boxes'
    };

    console.log("🛠️ Starting database cleanup...");

    for (const [oldCat, newCat] of Object.entries(mapping)) {
      const result = await Product.updateMany(
        { category: oldCat },
        { $set: { category: newCat } }
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${result.modifiedCount} items from "${oldCat}" to "${newCat}"`);
      }
    }

    // 3. Final Verification
    const finalCats = await Product.distinct('category');
    console.log("🏁 Final Categories in DB:", finalCats);

  } catch (error) {
    console.error("❌ ERROR:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

fixCategories();
