const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const { auth } = require('../middleware/auth');

// GET /api/leads - List all leads with filters
router.get('/', auth, async (req, res) => {
  try {
    const { status, source, priority, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sort).skip(skip).limit(parseInt(limit)).populate('assignedTo', 'name email'),
      Lead.countDocuments(query)
    ]);

    res.json({
      leads,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/leads/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/leads - Create lead
router.post('/', auth, [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/leads/:id - Update lead
router.put('/:id', auth, async (req, res) => {
  try {
    const { notes, followUps, ...updateData } = req.body;
    const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/leads/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/leads/:id/notes
router.post('/:id/notes', auth, [
  body('content').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    lead.notes.push({
      content: req.body.content,
      createdBy: req.user._id,
      createdByName: req.user.name
    });
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/leads/:id/notes/:noteId
router.delete('/:id/notes/:noteId', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    lead.notes = lead.notes.filter(n => n._id.toString() !== req.params.noteId);
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/leads/:id/followups
router.post('/:id/followups', auth, [
  body('date').isISO8601(),
  body('description').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    lead.followUps.push({ ...req.body, createdBy: req.user._id });
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/leads/:id/followups/:followupId
router.patch('/:id/followups/:followupId', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const followUp = lead.followUps.id(req.params.followupId);
    if (!followUp) return res.status(404).json({ error: 'Follow-up not found' });

    Object.assign(followUp, req.body);
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
