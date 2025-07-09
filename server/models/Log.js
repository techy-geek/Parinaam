const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  serial: Number,
  regNo: String,
  ip: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Log", logSchema);

