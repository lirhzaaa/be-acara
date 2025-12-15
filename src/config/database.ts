import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string),
      {
        dbName: "db-acara",
      };

    return Promise.resolve("Success database connected");
  } catch (error) {
    return Promise.reject(error);
  }
};

export default connect;
