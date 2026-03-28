import mongoose, { Schema, model, models } from "mongoose";

// 1. Define the Address structure
// Updated to include telephone (required) and isDefault toggle
const AddressSchema = new Schema({
  label: { 
    type: String, 
    enum: ["Office", "Home"], 
    default: "Office" 
  }, 
  addressLine1: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    default: "London" 
  },
  postcode: { 
    type: String, 
    required: true 
  },
  telephone: { 
    type: String, 
    required: true 
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  },
});

// 2. Define the User structure
const UserSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    // Required: false to support Google OAuth users who don't have passwords
    password: { 
      type: String, 
      required: false 
    },
    
    // Stores Google profile picture or custom uploads
    image: { 
      type: String 
    },

    // --- ROLE FIELD FOR ACCESS CONTROL ---
    role: { 
      type: String, 
      enum: ["customer", "admin", "chef"], 
      default: "customer" 
    },

    // --- VERIFICATION & SECURITY ---
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },

    // --- PASSWORD RESET ---
    resetToken: { type: String },
    resetTokenExpires: { type: Date },

    // --- ADDRESS BOOK ---
    addresses: [AddressSchema],
  },
  { 
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

/**
 * THE FIX: Safely check for the model in the mongoose instance.
 * This prevents "OverwriteModelError" during Next.js Hot Module Replacement (HMR).
 */
const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export { User }; 
export default User;