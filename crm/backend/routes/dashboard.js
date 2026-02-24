const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { auth } = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [statusCounts, sourceCounts, priorityCounts, recentLeads, totalValue] = await Promise.all([
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Lead.find().sort('-createdAt').limit(5).select('name email status createdAt'),
      Lead.aggregate([{ $group: { _id: null, total: { $sum: '$value' } } }])
    ]);

    const byStatus = {};
    statusCounts.forEach(s => byStatus[s._id] = s.count);

    const bySource = {};
    sourceCounts.forEach(s => bySource[s._id] = s.count);

    const byPriority = {};
    priorityCounts.forEach(p => byPriority[p._id] = p.count);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totals: {
        all: Object.values(byStatus).reduce((a, b) => a + b, 0),
        ...byStatus
      },
      bySource,
      byPriority,
      recentLeads,
      monthlyTrend,
      totalValue: totalValue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
