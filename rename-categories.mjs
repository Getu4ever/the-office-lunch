import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function rename() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ category: String }, { collection: 'products' }));

  const mapping = [
    { old: 'Signature', new: 'Sandwich Platters' },
    { old: 'Disposables', new: 'Plate, cutlery and napkins' },
    // If some items are meant to be Wrap Platters or Breakfast, 
    // we move a portion of 'Signature' to those categories:
  ];

  console.log("🛠️ Remapping categories to match Menu UI...");

  // 1. Rename 'Signature' to 'Sandwich Platters'
  await Product.updateMany({ category: 'Signature' }, { $set: { category: 'Sandwich Platters' } });
  
  // 2. Rename 'Disposables' to the correct Essentials string
  await Product.updateMany({ category: 'Disposables' }, { $set: { category: 'Plate, cutlery and napkins' } });

  // 3. Ensure 'Drinks' matches 'Drinks' (Case check)
  await Product.updateMany({ category: 'Drinks' }, { $set: { category: 'Drinks' } });

  const finalCats = await Product.distinct('category');
  console.log("🏁 CURRENT CATEGORIES IN DB:", finalCats);
  
  await mongoose.disconnect();
  process.exit();
}
rename();
