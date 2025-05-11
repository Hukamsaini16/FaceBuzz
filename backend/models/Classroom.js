import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});


classroomSchema.methods.comparePassword = function (inputPassword) {
  return inputPassword === this.password;
};

export default mongoose.model('Classroom', classroomSchema);
