import mongoose from "mongoose";

 export const connectDB = async () => { 
  await mongoose
    .connect(
      'mongodb+srv://hukamsaini:322252@cluster0.cjcdw.mongodb.net/face-base-attendance'
    )
    .then(() => console.log("DB Connected"));
};
