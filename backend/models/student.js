
// import mongoose from "mongoose";

// const studentSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   enrollNumber: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   faceDescriptor: {
//     type: [Number], // 128 float values
//     required: true,
//   },
// });

// // Ensure index gets built
// studentSchema.index({ enrollNumber: 1 }, { unique: true });

// export default mongoose.model("student", studentSchema);


import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  enrollNumber: { type: String, required: true, unique: true },
  faceDescriptor: { type: [Number], required: true },
});

studentSchema.index({ enrollNumber: 1 }, { unique: true });

export default mongoose.model("student", studentSchema);
