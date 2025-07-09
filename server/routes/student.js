const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(process.cwd(), "user-logs.txt"); // Always points to project root

router.get("/:regNo", async (req, res) => {
  const regNo = req.params.regNo.trim();

  // Count lines for serial number
  let serial = 1;
  if (fs.existsSync(logFilePath)) {
    const lines = fs.readFileSync(logFilePath, "utf-8").trim().split("\n");
    serial = lines.length + 1;
  }

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const timestamp = new Date().toISOString();
  const logLine = `#${serial} | ${timestamp} | IP: ${ip} | Roll: ${regNo}\n`;

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
