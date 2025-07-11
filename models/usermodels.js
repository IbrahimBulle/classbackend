import mongoose from "mongoose";

const ReadingSchema = mongoose.Schema({
    temp: {type: String},
    humidity: {type: String},
    soil_moisture: {type: String},
    light_intensity: {type: String},
})

const reading = mongoose.model("reading", ReadingSchema);

export default reading;