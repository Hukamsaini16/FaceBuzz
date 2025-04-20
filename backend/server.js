
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js"
import studentRoutes from "./routes/studentRoutes.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json()); // Important for parsing JSON bodies

connectDB();

app.use("/api", studentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
