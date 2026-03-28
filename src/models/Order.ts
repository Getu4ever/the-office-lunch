import mongoose, { Schema, model, models, Model } from 'mongoose';

interface IOrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string; // ADDED THIS
}

interface IOrder {
  orderId: string;
  userEmail: string;
  userName?: string;
  userId?: string;
  items: IOrderItem[];
  total: number;
  status: string;
  eventDate: string;
  deliverySlot: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // ADDED THIS
});

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  userName: { type: String },
  userId: { type: String },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: 'paid' },
  eventDate: { type: String, required: true },
  deliverySlot: { type: String, required: true },
}, { 
  timestamps: true 
});

const Order = (models.Order as Model<IOrder>) || model<IOrder>('Order', OrderSchema);

export default Order;