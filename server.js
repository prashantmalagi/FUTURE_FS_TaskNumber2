const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://prashantmalagi60_db_user:admin123@cluster0.oqgqzrt.mongodb.net/minicrm")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));


app.get("/", (req, res) => {
    res.send("Mini CRM Server Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
