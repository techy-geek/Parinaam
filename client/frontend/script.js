function getGradeColor(grade) {
  switch (grade) {
    case "AA": case "AB": return "green";
    case "BB": case "BC": return "#009DD1";
    case "CC": return "#FFA77F"; 
    case "CD": case "DP": return "#FD7979";
    case "-":  case "F" : return "red";
    default: return "black";
  }
}
const baseURL = "https://parinaam.onrender.com";

async function searchResult() {
  const roll = document.getElementById('rollInput').value.trim();
  const resultDiv = document.getElementById('result');

  if (!roll) {
    resultDiv.innerHTML = "<p>Please enter a roll number.</p>";
    return;
  }

  resultDiv.innerHTML = "<p>Loading...</p>";
  

  // Define subject lists before anything else
  const subjectsA = [
    "CE 102 - Environmental Science & Engg.",
    "CH 101 – Chemistry",
    "CH 111 – Chemistry (Lab)",
    "CS 101 – Introduction to Programming",
    "CS 111 - Programming Laboratory",
    "EC 101 - Basic Electronics",
    "EC 111 - Basic Electronics Laboratory",
    "MA 102 – Mathematics II",
    "ME 111 - Workshop Practice"
  ];

  const subjectsB = [
    "CE 101 - Engineering Graphics & Design",
    "EE 101 - Basic Electrical Engineering",
    "EE 111 - BEE Lab",
    "HS 101 - Communicative English",
    "HS 111 - Language Laboratory",
    "MA 102 – Mathematics II",
    "ME 101 - Engineering Mechanics",
    "PH 101 - Physics",
    "PH 111 - Physics Laboratory"
  ];

  try {
    const res = await fetch(`${baseURL}/api/student/${roll}`);
    const data = await res.json();

    if (data.error) {
      resultDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
    } else {
      // 🔍 Determine subject group from roll number
      const groupAStart = ["2411", "2415", "2416"];
      const rollPrefix = data.regNo.slice(0, 4);
      const subjectNames = groupAStart.includes(rollPrefix) ? subjectsA : subjectsB;
    let subjectsHTML = "";
    data.subjects.forEach((sub, index) => {
     const name = subjectNames[index] || `Subject ${index + 1}`;
    const gradeColor = getGradeColor(sub.grade);
    subjectsHTML += `<p><strong>${name}:</strong> ${sub.score} <span style="color:${gradeColor}">(${sub.grade})</span></p>`;
    });

      resultDiv.innerHTML = `
      <div class="result-card">
    <h3>🎓 Student Result</h3>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Roll No:</strong> ${data.regNo}</p>
    <p><strong>Branch:</strong> ${data.branch}</p>
    <p><strong>SGPA:</strong> ${data.sgpa}</p>
    <p><strong>CGPA:</strong> ${data.cgpa}</p>
    <p><strong>GP:</strong> ${data.gp}</p>
    ${subjectsHTML}
  </div>
`;

    }

  } catch (err) {
    resultDiv.innerHTML = `<p style="color: red;">Failed to fetch result. Server may be down.</p>`;
    console.error(err);
  }
}
