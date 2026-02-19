const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const Admin = require("./models/Admin");

// ✅ Connect MongoDB properly
mongoose
  .connect("mongodb+srv://prashantmalagi60_db_user:admin123@cluster0.oqgqzrt.mongodb.net/minicrm")
  .then(async () => {
    console.log("MongoDB Connected");

    // ✅ Create default admin AFTER DB connected
    const exists = await Admin.findOne({ username: "admin" });

    if (!exists) {
      await Admin.create({
        username: "admin",
        password: "admin123",
      });
      console.log("Default admin created");
    }
  })
  .catch((err) => console.log(err));

app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("Mini CRM Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
