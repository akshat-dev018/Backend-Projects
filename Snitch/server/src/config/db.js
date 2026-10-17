import mongoose from "mongoose"
import config from "./config.js";

export async function connectToDB(params) {
    await mongoose.connect(config.MONGO_URI);

}