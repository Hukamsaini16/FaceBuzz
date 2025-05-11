import mongoose from "mongoose";
const teacherAttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  attendance: [
    {
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
      },
      name: String,
    },
  ],
});

export default mongoose.model("TeacherAttendance", teacherAttendanceSchema);
