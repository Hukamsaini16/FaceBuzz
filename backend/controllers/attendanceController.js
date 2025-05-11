import StudentModel from "../models/student.js";
import StudentAttendanceModel from "../models/StudentAttendance.js";

// ✅ Store Daily Attendance Summary
export const storeDailyAttendanceSummary = async (req, res) => {
  try {
    const { classroomId, presentStudents, presentTeachers } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize time

    // Save student attendance if classroom is specified
    if (classroomId && presentStudents?.length) {
      // Avoid duplicate records
      const existingStudentRecord = await StudentAttendanceModel.findOne({
        classroomId,
        date: today,
      });
      if (!existingStudentRecord) {
        await StudentAttendanceModel.create({
          classroomId,
          date: today,
          presentStudents,
        });
      }
    }

    // Save teacher attendance
    if (presentTeachers?.length) {
      const existingTeacherRecord = await TeacherAttendanceModel.findOne({
        date: today,
      });
      if (!existingTeacherRecord) {
        await TeacherAttendance.create({
          date: today,
          presentTeachers,
        });
      }
    }

    res.status(200).json({ message: "Attendance summary stored successfully" });
  } catch (error) {
    console.error("Store attendance error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStudentsTodaySummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set to start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // next day

    // Get total number of students in the school
    const totalStudents = await StudentModel.countDocuments();

    // Find attendance records for today
    const todaysRecords = await StudentAttendanceModel.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // Combine all present student IDs from each classroom
    const presentStudentsSet = new Set();
    todaysRecords.forEach((record) => {
      record.presentStudents.forEach((id) =>
        presentStudentsSet.add(id.toString())
      );
    });

    const presentCount = presentStudentsSet.size;
    const percentage =
      totalStudents > 0
        ? ((presentCount / totalStudents) * 100).toFixed(2)
        : "0.00";

    res.json({
      date: today.toDateString(),
      present: presentCount,
      total: totalStudents,
      percentage: Number(percentage),
    });
  } catch (error) {
    console.error("Error fetching today's student summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Classroom-wise Attendance (For Charts or Admin View)
export const getClassroomWiseAttendance = async (req, res) => {
  try {
    const records = await StudentAttendanceModel.find({})
      .populate("classroomId", "name")
      .populate("presentStudents", "name");

    const classroomSummary = {};

    records.forEach((record) => {
      const className = record.classroomId.name;
      if (!classroomSummary[className]) {
        classroomSummary[className] = {
          dates: [],
          counts: [],
        };
      }
      classroomSummary[className].dates.push(
        record.date.toISOString().split("T")[0]
      );
      classroomSummary[className].counts.push(record.presentStudents.length);
    });

    res.status(200).json({ classroomSummary });
  } catch (error) {
    console.error("Classroom-wise summary error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
