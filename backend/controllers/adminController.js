import adminModel from "../models/Admin.js";
import jwt from 'jsonwebtoken';

// ✅ Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, adminId, faceDescriptor } = req.body;

    // Validate required fields
    if (!name || !adminId || !faceDescriptor || faceDescriptor.length !== 128) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }

    // Check if adminId is already registered
    const existingAdmin = await adminModel.findOne({ adminId });
    if (existingAdmin) {
      return res.status(409).json({ error: "Admin ID already registered" });
    }

    // Save new admin
    const newAdmin = new adminModel({
      name,
      adminId,
      faceDescriptor,
    });

    await newAdmin.save();

    res
      .status(201)
      .json({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all registered admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find({}, { _id: 1, name: 1, adminId: 1 });
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Failed to fetch admins" });
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

// ✅ Verify Admin Face

export const verifyAdmin = async (req, res) => {
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

    const admins = await adminModel.find({});

    let bestMatch = null;
    let minDistance = Number.MAX_VALUE;
    const threshold = 0.4;

    for (const admin of admins) {
      const dbDescriptor = admin.faceDescriptor;

      if (!Array.isArray(dbDescriptor) || dbDescriptor.length !== 128) continue;

      const distance = euclideanDistance(faceDescriptor, dbDescriptor);

      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = admin;
      }
    }

    if (bestMatch && minDistance <= threshold) {
      // ✅ Create token
      const token = jwt.sign(
        { id: bestMatch._id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // ✅ Set token in cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: false, // true if using HTTPS
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      return res.status(200).json({
        success: true,
        message: `Welcome ${bestMatch.name}`,
        name: bestMatch.name,
        adminId: bestMatch._id, // use _id instead of adminId if Mongoose
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

// ✅ Remove an admin
export const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Find admin by ID
    const admin = await adminModel.findById(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Remove the admin from the database
    await adminModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Admin removed successfully" });
  } catch (error) {
    console.error("Error removing admin:", error);
    res.status(500).json({ error: "Error removing admin" });
  }
};
