const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Log = require("../models/Log.js");
let serial = 1;
router.get("/:regNo", async (req, res) => {
  const regNo = req.params.regNo.trim();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const timestamp = new Date();

  try {
    const student = await Student.findOne({ regNo });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Log the request to DB
    await Log.create({
      serial: serial++,
      regNo,
      ip,
      timestamp
    });

    res.json(student);
  } catch (err) {
    console.error("Search/logging failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
