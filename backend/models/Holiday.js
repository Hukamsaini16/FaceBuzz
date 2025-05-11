import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  month: {
    type: String, // Format: "2025-01"
    required: true,
    unique: true,
  },
  dates: {
    type: [String], // Array of "YYYY-MM-DD" dates
    required: true,
    default: [],
  },
});

const Holiday = mongoose.model("Holiday", holidaySchema);

export default Holiday;
