import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncMenu() {
  try {
    // Look for menu-seed.json in the same folder as this script
    const jsonPath = path.resolve(__dirname, 'data/menu-seed.json');
    
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Could not find menu-seed.json at ${jsonPath}`);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const menuData = JSON.parse(rawData);

    let flatItems = [];

    // Loop through the object keys (Categories) to flatten the data for the API
    for (const [categoryName, items] of Object.entries(menuData)) {
      if (Array.isArray(items)) {
        console.log(`📦 Processing Category: "${categoryName}" (${items.length} items)`);
        
        const processed = items.map(item => ({
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: categoryName, // This ensures the DB knows which tab to show it in
          isAvailable: true,
          stock: 50
        }));
        
        flatItems = [...flatItems, ...processed];
      }
    }

    if (flatItems.length === 0) {
      throw new Error("No items found in menu-seed.json. Check the file content.");
    }

    console.log(`\n🚀 Sending ${flatItems.length} total items to the database...`);

    const response = await fetch('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flatItems)
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ SUCCESS: ${result.count || flatItems.length} items are now live!`);
    } else {
      console.error(`❌ API ERROR:`, result.error || result.message);
    }

  } catch (error) {
    console.error("❌ SCRIPT ERROR:", error.message);
  }
}

syncMenu();