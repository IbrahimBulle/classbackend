import mongoose from "mongoose";
const url = "mongodb+srv://abdiwalibulle:rgEDQQsxRP5uYRET@readings.oywl7kd.mongodb.net/?retryWrites=true&w=majority&appName=readings"
const connectDB = async () => {
	try {
		await mongoose.connect(url, {});
		console.log("success")

	} catch (error) {
		console.error("mongoose coneciton error", error)
		process.exit(1)
	}
}

export default connectDB;
