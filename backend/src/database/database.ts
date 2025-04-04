import mongoose from "mongoose";
import { config } from "../config/app.config";

const connectDb = async () => {
    try {
        const db = await mongoose.connect(config.MONGODB_URI);
        console.log(`Database connected`, db.connection.host);
    } catch (error) {
        console.log("Database connection error", error);
        process.exit(1);
    }
};

export default connectDb;