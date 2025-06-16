const names = require("../data/names.json");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Student = require("../models/Student");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const findName = (regNo) => {
  const match = names.find((n) => n.regNo === regNo);
  return match ? match.name : "Unknown";
};
const getBranch = (regNo) => {
  const prefix = regNo.toString().slice(0, 4);
  switch (prefix) {
    case "2411": return "Civil Engineering";
    case "2412": return "Computer Science & Engineering";
    case "2413": return "Electrical Engineering";
    case "2414": return "Electronics & Communication Engg.";
    case "2415": return "Electronics & Instrumentation Engg.";
    case "2416": return "Mechanical Engineering";
    default: return "Unknown Branch";
  }
};

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);

    const lines = data.text.split("\n").map(line => line.trim()).filter(line => /^\d+\s+241\d{4}/.test(line));

    const students = lines.map(line => {
      const parts = line.split(/\s+/);
      const slno = parts[0];
      const regNo = parts[1];
      const name = findName(regNo);
      const branch = getBranch(regNo);


      const subjects = [];
      for (let i = 2; i < parts.length - 4; i += 2) {
        subjects.push({ score: parts[i], grade: parts[i + 1] });
      }

      const gp = parts[parts.length - 4];
      const sgpa = parts[parts.length - 3];
      const cgpa = parts[parts.length - 2];
      const eaa = parts[parts.length - 1];

      return { slno, regNo, name,branch, subjects, gp, sgpa, cgpa, eaa };
    });

    await Student.deleteMany({});

    await Student.insertMany(students);

    res.json({
      message: "Students saved successfully!",
      count: students.length,
    });
  } catch (error) {
    console.error("Error in PDF upload:", error);
    res.status(500).json({ error: "Failed to process and save results" });
  }
});

module.exports = router;
