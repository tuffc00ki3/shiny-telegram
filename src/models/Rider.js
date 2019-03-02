const mongoose = require("mongoose");
const { Schema } = mongoose;

const riderSchema = new Schema({
  name: { type: String, required: true },
  num: { type: Number, required: true },
  lapTimes: { type: Array },
  totalTime: { type: Number, default: 0 }
  //position:{type:Number, default:0},
  //isWinner_flag: {type:Boolean, default:false}
});

module.exports = riderSchema;
