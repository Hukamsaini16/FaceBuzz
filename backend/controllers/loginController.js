import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";

// Helper to calculate Euclidean distance
function euclideanDistance(desc1, desc2) {
  return Math.sqrt(
    desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0)
  );
}

export const faceLogin = async (req, res) => {
  try {
    const { faceDescriptor } = req.body;

    if (!faceDescriptor) {
      return res
        .status(400)
        .json({ success: false, message: "Face descriptor missing" });
    }

    const threshold = 0.4;
    let bestMatch = null;
    let minDistance = Infinity;
    let role = null;

    // Check against Teachers
    const teachers = await Teacher.find();
    for (const teacher of teachers) {
      const distance = euclideanDistance(
        teacher.faceDescriptor,
        faceDescriptor
      );
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = {
          _id: teacher._id,
          name: teacher.name,
          id: teacher.teacherId,
        };
        role = "teacher";
      }
    }

    // Check against Admins
    const admins = await Admin.find();
    for (const admin of admins) {
      const distance = euclideanDistance(admin.faceDescriptor, faceDescriptor);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = {
          _id: admin._id,
          name: admin.name,
          id: admin.adminId,
        };
        role = "admin";
      }
    }

    if (minDistance <= threshold && bestMatch && role) {
      return res.json({
        success: true,
        role,
        user: bestMatch,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Face not matched" });
    }
  } catch (err) {
    console.error("Face login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
