const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const verifyToken = require("../middleware/middleware/authMiddleware");

// CREATE
router.post("/", verifyToken, async (req, res) => {
    try {
        const newLead = new Lead(req.body);
        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET
router.get("/", verifyToken, async (req, res) => {
    try {
        const leads = await Lead.find();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedLead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const deletedLead = await Lead.findByIdAndDelete(req.params.id);

        if (!deletedLead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        res.json({ message: "Lead deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
