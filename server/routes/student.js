const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET /api/student/:regNo
router.get("/:regNo", async (req, res) => {
  try {
    const student = await Student.findOne({ regNo: req.params.regNo });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/student/analytics/basic
router.get("/analytics/basic", async (req, res) => {
  try {
    const students = await Student.find();

    if (!students.length) {
      return res.status(404).json({ error: "No student data found" });
    }

    // ✅ Calculate averages
    const totalStudents = students.length;

    const avgSgpa =
      students.reduce((acc, curr) => acc + parseFloat(curr.sgpa || 0), 0) /
      totalStudents;

    const avgCgpa =
      students.reduce((acc, curr) => acc + parseFloat(curr.cgpa || 0), 0) /
      totalStudents;

    // ✅ Find topper by CGPA
    const topper = students.reduce((max, curr) =>
      parseFloat(curr.cgpa || 0) > parseFloat(max.cgpa || 0) ? curr : max
    );

    res.json({
      totalStudents,
      avgSgpa: avgSgpa.toFixed(2),
      avgCgpa: avgCgpa.toFixed(2),
      topper: {
        regNo: topper.regNo,
        name: topper.name,
        cgpa: topper.cgpa,
        sgpa: topper.sgpa,
      },
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to calculate analytics" });
  }
});

module.exports = router;
