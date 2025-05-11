import mongoose from "mongoose";

const studentAttendanceSchema = new mongoose.Schema({
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  presentStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

// ✅ Fix: Prevent OverwriteModelError
const studentAttendanceModel =
  mongoose.models.StudentAttendance ||
  mongoose.model("StudentAttendance", studentAttendanceSchema);

export default studentAttendanceModel;
