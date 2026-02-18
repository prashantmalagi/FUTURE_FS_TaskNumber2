const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    source: String,
    status: { type: String, default: "new" },
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Lead", leadSchema);
