const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const fs = require("fs");
const path = require("path");
const logFilePath = path.join(process.cwd(), "user-logs.txt"); // ✅ always points to root

router.get("/:regNo", async (req, res) => {
  const regNo = req.params.regNo.trim();
  console.log("📩 API called for roll:", regNo);
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} | IP: ${ip} | Roll: ${regNo}\n`;

  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) console.error("Log write failed:", err);
  });

  try {
    const student = await Student.findOne({ regNo });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
