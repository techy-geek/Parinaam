const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/logs", (req, res) => {
  const logPath = path.join(__dirname, "..", "user-logs.txt");

  
  fs.readFile(logPath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading logs:", err);
      return res.status(500).send("Unable to read log file.");
    }

    // Optional: reverse order so latest logs come first
    const logLines = data.trim().split("\n").reverse();

    res.send(`
      <html>
        <head>
          <title>Parinaam - Log Viewer</title>
          <style>
            body { font-family: monospace; background: #111; color: #0f0; padding: 20px; }
            h2 { color: #fff; }
            .log { white-space: pre-line; line-height: 1.5; }
          </style>
        </head>
        <body>
          <h2>📋 Parinaam - Log Viewer</h2>
          <div class="log">
            ${logLines.join("<br>")}
          </div>
        </body>
      </html>
    `);
  });
});

module.exports = router;
