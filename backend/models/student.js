import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  enrollNumber: { type: String, required: true, unique: true },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  faceDescriptor: { type: [Number], required: true },
});

export default mongoose.model("Student", studentSchema);
