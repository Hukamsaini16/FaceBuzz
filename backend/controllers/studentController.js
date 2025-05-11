import Classroom from "../models/Classroom.js";
import studentModel from "../models/student.js";

import moment from "moment";
import mongoose from "mongoose";
import studentAttendanceModel from "../models/studentAttendance.js";

// Utility to calculate Euclidean Distance
const euclideanDistance = (desc1, desc2) => {
  return Math.sqrt(
    desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0)
  );
};

// ✅ Register a student with face descriptor
export const registerStudent = async (req, res) => {
  const { enrollNumber, name, faceDescriptor, classId } = req.body;
  console.log(enrollNumber, name, faceDescriptor, classId);

  try {
    // Check for duplicate enrollment number
    const existingStudent = await studentModel.findOne({ enrollNumber });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Enrollment number already exists. Please use a unique one.",
      });
    }

    const newStudent = new studentModel({
      enrollNumber,
      name,
      faceDescriptor,
      classId,
    });

    const savedStudent = await newStudent.save();

    // Add student ID to the classroom's student array
    await Classroom.findByIdAndUpdate(classId, {
      $push: { students: savedStudent._id },
    });

    res.status(201).json({ success: true, student: savedStudent });
  } catch (error) {
    console.error("Error registering student:", error);
    res
      .status(500)
      .json({ success: false, message: "Student registration failed." });
  }
};

const FACE_MATCH_THRESHOLD = 0.4;

// Verify student face descriptor
export const verifyStudent = async (req, res) => {
  try {
    const { faceDescriptor, classId } = req.body;
    const students = await studentModel.find({ classId });

    let matchedStudent = null;
    for (const student of students) {
      const distance = euclideanDistance(
        student.faceDescriptor,
        faceDescriptor
      );
      if (distance < FACE_MATCH_THRESHOLD) {
        matchedStudent = student;
        break;
      }
    }

    if (!matchedStudent) {
      return res
        .status(401)
        .json({ success: false, message: "Face not matched" });
    }

    res.status(200).json({
      success: true,
      studentId: matchedStudent._id,
      name: matchedStudent.name,
    });
  } catch (error) {
    console.error("Error verifying student:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};


export const markStudentAttendance = async (req, res) => {
  try {
    const { date, classId, presentStudents } = req.body;
    console.log(date, classId, presentStudents);

    if (!presentStudents || !Array.isArray(presentStudents)) {
      return res
        .status(400)
        .json({ error: "presentStudents must be an array." });
    }

    // Manually fix the date using toLocaleDateString to ensure correct local date without time shift
    const formattedDate = new Date(new Date(date).toLocaleDateString("en-CA")); // This ensures the local date format is used

    const presentStudentIds = presentStudents;

    // Find existing record
    const existingRecord = await studentAttendanceModel.findOne({
      classroomId: classId,
      date: formattedDate,
    });

    if (existingRecord) {
      // ❗ Update the existing record (overwrite)
      existingRecord.presentStudents = presentStudentIds;
      await existingRecord.save();
    } else {
      // Create new record
      await studentAttendanceModel.create({
        classroomId: classId,
        date: formattedDate,
        presentStudents: presentStudentIds,
      });
    }

    res.status(200).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving student attendance:", error);
    res.status(500).json({ error: "Failed to save attendance" });
  }
};



export const getMonthlyStudentAttendance = async (req, res) => {
  try {
    const { classId, year, month } = req.query;

    if (!classId || !year || !month) {
      return res.status(400).json({ error: "Missing classId, year, or month" });
    }

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, parseInt(month) + 1, 0);

    // ✅ Fetch all students from the specified class
    const students = await studentModel.find({ classId });

    // ✅ Fetch all attendance records for that class in the month
    const attendanceRecords = await studentAttendanceModel.find({
      classroomId: classId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // ✅ Prepare attendance data per student
    const studentMap = students.map((student) => {
      const presentDates = attendanceRecords
        .filter((record) =>
          record.presentStudents.some(
            (sId) => sId.toString() === student._id.toString()
          )
        )
        .map((record) => new Date(record.date).toISOString().split("T")[0]);

      return {
        name: student.name,
        attendance: presentDates,
      };
    });

    res.status(200).json(studentMap);
  } catch (error) {
    console.error("Error fetching monthly student attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await studentModel.find(
      {},
      { _id: 0, name: 1, enrollNumber: 1, classId: 1 }
    );
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students." });
  }
};

// ✅ Get total student count
export const studentCount = async (req, res) => {
  try {
    const count = await studentModel.countDocuments();
    res.json({ total: count });
  } catch (error) {
    res.status(500).json({ error: "Error counting students" });
  }
};

//all student by classid
export const getStudentsByClassId = async (req, res) => {
  const { classId } = req.params;

  console.log(classId);
  try {
    const students = await studentModel.find({ classId });

    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No students found for this class" });
    }

    res.status(200).json({ success: true, students });
  } catch (err) {
    console.error("Error fetching students by classId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  const { classId } = req.query;

  console.log("Deleting student:", studentId, "from class:", classId);

  try {
    const foundStudent = await studentModel.findById(studentId);
    if (!foundStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Confirm student belongs to this class
    if (foundStudent.classId.toString() !== classId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    // Remove student from the classroom
    await Classroom.findByIdAndUpdate(classId, {
      $pull: { students: studentId },
    });

    // Delete the student document
    await studentModel.findByIdAndDelete(studentId);

    // Remove student from all attendance records where they were present
    await studentAttendanceModel.updateMany(
      { classroomId: classId },
      { $pull: { presentStudents: studentId } }
    );

    return res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
