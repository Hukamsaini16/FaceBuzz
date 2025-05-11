import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacherId: { type: String, required: true, unique: true },
  faceDescriptor: { type: [Number], required: true },
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
});

export default mongoose.model('Teacher', teacherSchema);
