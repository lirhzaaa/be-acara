import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    return "Success database connected";
  } catch (error) {
    throw error;
  }
};

export default connect;
