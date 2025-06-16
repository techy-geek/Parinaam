const fs = require("fs");
const pdf = require("pdf-parse");

const buffer = fs.readFileSync("./name.pdf");

const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

pdf(buffer).then((data) => {
  const lines = data.text.split("\n");
  const students = [];
  const seen = new Set();

  for (let line of lines) {
    line = line.trim();

    // Skip header or blank line
    if (!line || line.toLowerCase().includes("reg")) continue;

    // Find regNo embedded in the line
    const regMatch = line.match(/(2\d{6})/);
    if (regMatch) {
      const regNo = regMatch[1];
      const nameStart = line.indexOf(regNo) + regNo.length;
      const rawName = line.slice(nameStart).trim();
      const name = toTitleCase(rawName);

      if (regNo && name && !seen.has(regNo)) {
        students.push({ regNo, name });
        seen.add(regNo);
      }
    }
  }

  fs.writeFileSync("./data/names.json", JSON.stringify(students, null, 2));
  console.log(`✅ Extracted ${students.length} students`);
});
