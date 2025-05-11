import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adminId: { type: String, required: true, unique: true },
  faceDescriptor: { type: [Number], required: true },
});

export default mongoose.model('Admin', adminSchema);
