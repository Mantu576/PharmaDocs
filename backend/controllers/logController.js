// controllers/logController.js
const Log = require('../models/Log');
const { Parser } = require('json2csv');

exports.getLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      username,
      startDate,
      endDate,
      sort = 'desc' // optional sort param
    } = req.query;

    const filter = {};

    if (username) {
      filter.username = { $regex: username, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) {
        // include entire endDate day
        const d = new Date(endDate);
        d.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = d;
      }
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const sortOption = { timestamp: sort === 'asc' ? 1 : -1 };

    const [logs, total] = await Promise.all([
      Log.find(filter).sort(sortOption).skip(skip).limit(Number(limit)).lean(),
      Log.countDocuments(filter)
    ]);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit) || 1),
      logs
    });
  } catch (err) {
    console.error('getLogs error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.exportLogsCSV = async (req, res) => {
  try {
    const { username, startDate, endDate } = req.query;

    const filter = {};
    if (username) filter.username = { $regex: username, $options: 'i' };
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) {
        const d = new Date(endDate);
        d.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = d;
      }
    }

    const logs = await Log.find(filter).sort({ timestamp: -1 }).lean();

    if (!logs.length) {
      return res.status(400).json({ error: 'No logs to export for given filters' });
    }

    const fields = ['username', 'action', 'filename', 'timestamp'];
    const opts = { fields, transforms: [(row) => ({ ...row, timestamp: row.timestamp ? new Date(row.timestamp).toISOString() : '' })] };
    const parser = new Parser(opts);
    const csv = parser.parse(logs);

    const filename = `logs_${new Date().toISOString().replace(/[:.]/g,'-')}.csv`;
    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
  } catch (err) {
    console.error('exportLogsCSV error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
