require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Active Status: Working Good");
});

const adminRoutes = require("./routes/adminRouter");
app.use("/admin", adminRoutes);

const uploadRoute = require("./routes/upload");
app.use("/api", uploadRoute);

const studentRoute = require("./routes/student");
app.use("/api/student", studentRoute);

app.get("/", (req, res) => res.send("Server is running"));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection failed", err);
});

