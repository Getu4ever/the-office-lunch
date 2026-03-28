import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load your environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runRepair() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected.");

    // Define the Schema locally to ensure we aren't using a cached/broken model
    const ProductSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      category: String,
      image: String,
      isAvailable: Boolean,
      stock: Number,
      sellCount: Number,
      allergens: [String]
    }, { collection: 'products' });

    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    // 1. THE WIPE
    console.log("🧨 DELETING OLD PRODUCTS...");
    const deleteResult = await Product.deleteMany({});
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} old items.`);

    // 2. THE SEED
    const jsonPath = path.resolve(__dirname, 'data', 'menu-seed.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON file not found at ${jsonPath}`);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const menuData = JSON.parse(rawData);

    const flatItems = [];
    Object.entries(menuData).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          flatItems.push({
            name: item.name,
            description: item.description,
            price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[£,]/g, '')) : item.price,
            category: category,
            image: item.image,
            isAvailable: true,
            stock: 50,
            sellCount: 0,
            allergens: item.allergens || []
          });
        });
      }
    });

    console.log(`📦 Preparing to insert ${flatItems.length} items...`);
    const insertResult = await Product.insertMany(flatItems);
    console.log(`🚀 SUCCESS! Inserted ${insertResult.length} new items.`);

  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit();
  }
}

runRepair();