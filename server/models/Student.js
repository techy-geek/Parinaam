const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  score: String,
  grade: String,
});

const StudentSchema = new mongoose.Schema({
  slno: String,
  regNo: String,
  name: String,       
  branch: String, 
  subjects: [SubjectSchema],
  gp: String,
  sgpa: String,
  cgpa: String,
  eaa: String,
});

module.exports = mongoose.model("Student", StudentSchema);
