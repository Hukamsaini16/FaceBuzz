import teacherModel from "../models/Teacher.js";

import teacherAttendanceModel from "../models/teacherAttendance.js";
import dayjs from "dayjs";
import jwt from 'jsonwebtoken';
//const JWT_SECRET = 'yourSecretKey';

// ✅ Register Teacher
export const registerTeacher = async (req, res) => {
  try {
    const { name, teacherId, faceDescriptor } = req.body;

    // Validate required fields
    if (
      !name ||
      !teacherId ||
      !faceDescriptor ||
      faceDescriptor.length !== 128
    ) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }

    // Check if teacherId is already registered
    const existingTeacher = await teacherModel.findOne({ teacherId });
    if (existingTeacher) {
      return res.status(409).json({ error: "Teacher ID already registered" });
    }

    // Save new teacher
    const newTeacher = new teacherModel({
      name,
      teacherId,
      faceDescriptor,
      assignedClasses: [], // optional: leave empty or modify as needed
    });

    await newTeacher.save();

    res
      .status(201)
      .json({ success: true, message: "Teacher registered successfully" });
  } catch (error) {
    console.error("Error registering teacher:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const euclideanDistance = (desc1, desc2) => {
  if (
    !Array.isArray(desc1) ||
    !Array.isArray(desc2) ||
    desc1.length !== desc2.length
  )
    return Infinity;
  return Math.sqrt(
    desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0)
  );
};

export const verifyTeacher = async (req, res) => {
  try {
    const { faceDescriptor } = req.body;

    if (
      !faceDescriptor ||
      !Array.isArray(faceDescriptor) ||
      faceDescriptor.length !== 128
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid face descriptor." });
    }

    const teachers = await teacherModel.find({});

    let bestMatch = null;
    let minDistance = Number.MAX_VALUE;
    const threshold = 0.4;

    for (const teacher of teachers) {
      const dbDescriptor = teacher.faceDescriptor;

      if (!Array.isArray(dbDescriptor) || dbDescriptor.length !== 128) continue;

      const distance = euclideanDistance(faceDescriptor, dbDescriptor);

      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = teacher;
      }
    }

    if (bestMatch && minDistance <= threshold) {
      // ✅ Create token
      const token = jwt.sign(
        { id: bestMatch._id, role: 'teacher' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // ✅ Set token in cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: false, // true if https
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      return res.status(200).json({
        success: true,
        message: `Welcome ${bestMatch.name}`,
        name: bestMatch.name,
        teacherId: bestMatch._id, // use _id like admin
        distance: minDistance.toFixed(4),
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Face not matched. Try again.",
        distance: minDistance.toFixed(4),
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ✅ Get all registered teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.find(
      {},
      { _id: 1, name: 1, teacherId: 1 }
    );
    res.status(200).json({ teachers });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
};

export const getMonthlyTeacherAttendance = async (req, res) => {
  try {
    const { year, month } = req.query;

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, parseInt(month) + 1, 0);

    const teachers = await teacherModel.find();

    const attendanceRecords = await teacherAttendanceModel.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const teacherMap = teachers.map((teacher) => {
      const presentDates = attendanceRecords
        .filter((record) =>
          record.attendance.some(
            (att) => att.teacherId.toString() === teacher._id.toString()
          )
        )
        .map(
          (record) => new Date(record.date).toISOString().split("T")[0] // convert to 'YYYY-MM-DD'
        );

      return {
        name: teacher.name,
        attendance: presentDates,
      };
    });

    res.status(200).json(teacherMap);
  } catch (err) {
    console.error("Error fetching teacher attendance:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const saveTeacherAttendance = async (req, res) => {
  try {
    const { date, teachersPresent } = req.body;
    console.log(date, teachersPresent);

    if (!Array.isArray(teachersPresent)) {
      return res.status(400).json({
        message: "Invalid or missing 'teachersPresent' array in request body.",
      });
    }

    // const attendanceDate = new Date(new Date(date).toDateString()); // clears time part
    // attendanceDate.setHours(0, 0, 0, 0);
    const localDateString = new Date(date).toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
    const attendanceDate = new Date(localDateString);


    // 🚀 Directly use the teacherId and name from frontend
    const formattedAttendance = teachersPresent.map((entry) => ({
      teacherId: entry.teacherId, // Assuming this is MongoDB _id
      name: entry.name,
      status: entry.status || "Present", // If you are not sending status, default to "Present"
    }));

    const existingAttendance = await teacherAttendanceModel.findOne({
      date: attendanceDate,
    });

    if (existingAttendance) {
      existingAttendance.attendance = formattedAttendance;
      await existingAttendance.save();
      return res.status(200).json({ message: "Attendance updated successfully." });
    } else {
      const newAttendance = new teacherAttendanceModel({
        date: attendanceDate,
        attendance: formattedAttendance,
      });
      await newAttendance.save();
      return res.status(201).json({ message: "Attendance saved successfully." });
    }
  } catch (error) {
    console.error("Error saving teacher attendance:", error);
    return res
      .status(500)
      .json({ message: error.message || "Server error, try again later." });
  }
};


// ✅ Remove a teacher
export const removeTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await teacherModel.findByIdAndDelete(id);
    if (teacher) {
      await teacherAttendanceModel.deleteMany({ teacherId: teacher.teacherId }); // clean attendance by teacherId
    }

    res.json({ message: "Teacher removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error removing teacher" });
  }
};









