import mongoose from "mongoose";
import teacherModel from "../models/Teacher.js";
import studentModel from "../models/Student.js";
import StudentAttendanceModel from "../models/StudentAttendance.js";
import Classroom from "../models/Classroom.js";

export const createClassroom = async (req, res) => {
  const { name, password, teacherId } = req.body;
  console.log("Received Data:", { name, password, teacherId });

  if (!name || !password || !teacherId) {
    return res
      .status(400)
      .json({ success: false, message: "Name, password, and teacherId are required." });
  }

  try {
    // Check if the classroom name is unique
    const existingClassroom = await Classroom.findOne({ name });
    if (existingClassroom) {
      return res
        .status(400)
        .json({ success: false, message: "Classroom name already exists." });
    }

    // Find teacher by MongoDB _id
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found." });
    }

    // 🚀 Check if teacher already created a classroom
    const teacherExistingClassroom = await Classroom.findOne({ createdBy: teacherId });
    if (teacherExistingClassroom) {
      return res
        .status(400)
        .json({ success: false, message: "Each teacher can create only one classroom." });
    }

    // Create new classroom
    const classroom = new Classroom({
      name,
      password, // plain password (will be hashed by pre-save hook)
      createdBy: teacher._id,
    });

    await classroom.save();

    return res.status(201).json({
      success: true,
      message: "Classroom created successfully.",
      classroom,
    });
  } catch (error) {
    console.error("❌ Error creating classroom:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};


//✅ Get All Classrooms by name
export const AllClassroomsbyname = async (req, res) => {
  try {
    const classrooms = await Classroom.find({})
      .populate("createdBy", "name")
      .select("name createdBy students");
    res.status(200).json({ classrooms });
  } catch (error) {
    console.error("Fetch classrooms error:", error);
    res.status(500).json({ error: "Failed to fetch classrooms" });
  }
};

export const getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find()
      .populate("createdBy", "name") // Populate teacher name
      .lean(); // use .lean() to allow adding custom fields

    // Loop through each classroom and count students
    for (let classroom of classrooms) {
      const count = await studentModel.countDocuments({ classId: classroom._id });
      classroom.totalStudents = count; // add totalStudents to the classroom object
    }

    // Include password in the response (ensure that it's not sensitive information)
    // If it's sensitive, you might want to mask or skip sending it
    const classroomsWithPassword = classrooms.map(classroom => ({
      ...classroom,
      password: classroom.password, // Include the password in the response
    }));

    res.json(classroomsWithPassword);
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({ message: "Error fetching classrooms" });
  }
};



// ✅ Get Classroom by ID
export const getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid classroom ID" });
    }

    const classroom = await Classroom.findById(id)
      .populate("createdBy", "name")
      .populate("students", "name enrollNumber");

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    // Include the password in the response (again, be cautious with sending sensitive data)
    const classroomWithPassword = {
      ...classroom.toObject(),
      password: classroom.password, // Include the password in the response
    };

    res.status(200).json({ classroom: classroomWithPassword });
  } catch (error) {
    console.error("Get classroom by ID error:", error);
    res.status(500).json({ error: "Failed to get classroom" });
  }
};



export const deleteClassroom = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid classroom ID" });
  }

  try {
    // First delete the classroom
    const classroom = await Classroom.findByIdAndDelete(id);

    if (!classroom) {
      return res
        .status(404)
        .json({ success: false, message: "Classroom not found." });
    }

    // Then delete students associated with this classroom
    const deletedStudents = await Student.deleteMany({ classId: id });

    console.log(`Deleted ${deletedStudents.deletedCount} students related to classroom.`);

    // Then delete student attendance records associated with this classroom
    const deletedAttendances = await StudentAttendanceModel.deleteMany({ classroomId: id });

    console.log(`Deleted ${deletedAttendances.deletedCount} student attendance records.`);

    return res
      .status(200)
      .json({ 
        success: true, 
        message: "Classroom, associated students, and student attendances deleted successfully." 
      });
  } catch (error) {
    console.error("❌ Error deleting classroom, students, and attendances:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const verifyclassroompassword = async (req, res) => {
  const { id, password } = req.body;
  //console.log(id,password);

  if (!id || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing classroom ID or password." });
  }

  try {
    const classroom = await Classroom.findById(id);
    if (!classroom) {
      return res
        .status(404)
        .json({ success: false, message: "Classroom not found." });
    }

    const isMatch = await classroom.comparePassword(password); // calls method from your schema
    if (isMatch) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Incorrect password." });
    }
  } catch (err) {
    console.error("Error verifying password:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// GET /api/classrooms/:classId
export const getClassroomByobjectid = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.classId);
    if (!classroom)
      return res
        .status(404)
        .json({ success: false, message: "Classroom not found" });
    res.json({ success: true, classroom });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
