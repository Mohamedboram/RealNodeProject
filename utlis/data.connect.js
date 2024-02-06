import mongoose from "mongoose";
import createError from "./createError.js";

function connect() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => createError.createError(500, "Failed", err.message));
}

export default connect;
