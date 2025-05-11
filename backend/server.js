
// import express from "express";
// import cors from "cors";
// import { connectDB } from "./config/db.js"
// import studentRoutes from "./routes/studentRoutes.js";
// import teacherRoutes from "./routes/teacherRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import classroomRoutes from "./routes/classroomRoutes.js";
// import attendanceRoutes from "./routes/attendanceRoutes.js";


// const app = express();
// app.use(cors());
// app.use(express.json());

// connectDB();

// app.use("/api/students", studentRoutes);
// app.use("/api/teachers", teacherRoutes);
// app.use("/api/admins", adminRoutes);
// app.use("/api/classrooms", classroomRoutes);
// app.use("/api/attendance", attendanceRoutes);


// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });






// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from 'cookie-parser';
// import { connectDB } from "./config/db.js"
// import studentRoutes from "./routes/studentRoutes.js";
// import teacherRoutes from "./routes/teacherRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import classroomRoutes from "./routes/classroomRoutes.js";
// import attendanceRoutes from "./routes/attendanceRoutes.js";
// import holidayRoutes from "./routes/holidayRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

// dotenv.config();
// const app = express();
// app.use(cookieParser());
// app.use(cors({
//   origin: process.env.FRONTEND_URL, // your frontend address
//   credentials: true // 🔥 important to allow cookies
// }));
// app.use(express.json());

// connectDB();

// app.use("/api/students", studentRoutes);
// app.use("/api/teachers", teacherRoutes);
// app.use("/api/admins", adminRoutes);
// app.use("/api/classrooms", classroomRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/holidays", holidayRoutes);
// app.use("/api", authRoutes);

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import classroomRoutes from "./routes/classroomRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import holidayRoutes from "./routes/holidayRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ Connect Database
connectDB();

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Enhanced CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
app.use(cors(corsOptions));

// ✅ Route Definitions
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api", authRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ success: false, message: "Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


