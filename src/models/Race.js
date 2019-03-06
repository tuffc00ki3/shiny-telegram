const mongoose = require("mongoose");
const RiderSchema = require("./Rider");
const { Schema } = mongoose;

const raceSchema = new Schema({
  title: { type: String, required: true },
  numLaps: { type: Number, required: true },
  riders: [RiderSchema],
  isLast_flag: { type: Boolean, default: true }
});

const Race = mongoose.model("race", raceSchema);
module.exports = Race;
