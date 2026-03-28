import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    // Note: These are your internal functional categories
    enum: [
      'Sandwich Platters', 
      'Wrap Platters', 
      'Individual Sandwiches', 
      'Individual Boxes', 
      'Salad', 
      'Breakfast Menu', 
      'Deserts', 
      'Snacks', 
      'Drinks', 
      'Plate, cutlery and napkins'
    ]
  },
  // ADD THIS LINE - This is why your homepage items were invisible
  homeTab: { 
    type: String, 
    default: "" 
  },
  image: { 
    type: String, 
    required: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  stock: { 
    type: Number, 
    default: 50 
  },
  sellCount: { 
    type: Number, 
    default: 0 
  },
  allergens: {
    type: [String], 
    default: []
  },
  calories: { 
    type: Number 
  },
}, { 
  timestamps: true,
  collection: 'products' 
});

// Force re-initialization to ensure the new 'homeTab' field is recognized immediately
if (models.Product) {
  delete (mongoose as any).models.Product;
}

const Product = model("Product", ProductSchema);
export default Product;