
import student from "../models/student.js";


//Register a student with face descriptor
export const registerStudent = async (req, res) => {
  try {
    const { name, enrollNumber, faceDescriptor } = req.body;

    if (!faceDescriptor || faceDescriptor.length !== 128) {
      return res.status(400).json({ error: "Invalid or missing face descriptor" });
    }

    // Check if student already exists
    const existing = await student.findOne({ enrollNumber });
    if (existing) {
      return res.status(409).json({ error: "Student already registered" });
    }

    const newStudent = new student({
      name,
      enrollNumber,
      faceDescriptor,
    });

    await newStudent.save();

    return res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const registerStudent = async (req, res) => {
//   try {
//     const { enrollNumber, name, faceDescriptor } = req.body;

//     if (!enrollNumber || !name || !faceDescriptor) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const student = new student({ enrollNumber, name, faceDescriptor });
//     await student.save();

//     res.status(201).json({ message: "Student registered successfully!" });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(409).json({ error: "Enrollment already exists", code: 11000 });
//     }

//     console.error("Error in registration:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// export const verifyStudent = async (req, res) => {
//   try {
//     const { faceDescriptor } = req.body;

//     if (!faceDescriptor || faceDescriptor.length !== 128) {
//       return res.status(400).json({ error: "Invalid face descriptor" });
//     }

//     const students = await student.find(); // ✅ correct model

//     let matchedStudent = null;
//     let minDistance = Infinity;

//     for (let student of students) {
//       const storedDescriptor = student.faceDescriptor;

//       const distance = Math.sqrt(
//         storedDescriptor.reduce((sum, value, index) => {
//           return sum + Math.pow(value - faceDescriptor[index], 2);
//         }, 0)
//       );

//       // ✅ Optional: track closest match
//       if (distance < minDistance) {
//         minDistance = distance;
//         matchedStudent = student;
//       }
//     }

//     if (matchedStudent && minDistance < 0.6) {
//       return res.status(200).json({
//         success: true,
//         name: matchedStudent.name,
//         enrollNumber: matchedStudent.enrollNumber,
//         distance: minDistance.toFixed(4),
//       });
//     } else {
//       return res.status(404).json({ success: false, error: "Face not matched" });
//     }
//   } catch (error) {
//     console.error("Error verifying student:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };


const euclideanDistance = (desc1, desc2) => {
  return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
};

export const verifyStudent = async (req, res) => {
  try {
    const { faceDescriptor } = req.body;
    if (!faceDescriptor || !Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
      return res.status(400).json({ success: false, message: "Invalid face descriptor." });
    }

    const students = await student.find({});
    let bestMatch = null;
    let minDistance = Number.MAX_VALUE;
    const threshold = 0.4; // lower is stricter

    for (const student of students) {
      const dist = euclideanDistance(faceDescriptor, student.faceDescriptor);
      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = student;
      }
    }

    if (minDistance <= threshold) {
      return res.status(200).json({
        success: true,
        message: "Face matched.",
        name: bestMatch.name,
        enrollNumber: bestMatch.enrollNumber,
        distance: minDistance.toFixed(4),
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Face not matched. Too dissimilar.",
        distance: minDistance.toFixed(4),
      });
    }

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const studentCount = async (req, res) => {
  const count = await student.countDocuments();
  res.json({ total: count });
}



export const getAllStudents = async (req, res) => {
  try {
    const students = await student.find({}, { _id: 0, name: 1, enrollNumber: 1, faceDescriptor: 1 });
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students." });
  }
};

