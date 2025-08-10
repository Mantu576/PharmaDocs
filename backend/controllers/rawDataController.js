const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const math = require('mathjs');
const Log = require('../models/Log'); // Assuming you have a Log model for logging actions
const generateLineChart = require('../utils/chartService');

exports.processRawData = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = path.join(__dirname, '..', file.path);
    const ext = path.extname(file.originalname).toLowerCase();

    let data;
    if (ext === '.xlsx' || ext === '.csv') {
      const workbook = xlsx.readFile(filePath);
      console.log('Workbook sheets:', workbook.SheetNames);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = xlsx.utils.sheet_to_json(sheet);
      console.log('Parsed data:', data);
    } else {
      console.log('Unsupported file type:', ext);
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    if (!data || !data.length) {
      console.log('No data found in file');
      return res.status(400).json({ error: 'No data found in file' });
    }

    const columns = Object.keys(data[0]);
    let selectedColumn = null;
    let values = [];

    for (const col of columns) {
      values = data.map(row => parseFloat(row[col])).filter(n => !isNaN(n));
      if (values.length > 0) {
        selectedColumn = col;
        break;
      }
    }

    console.log('Selected column:', selectedColumn);
    console.log('Numeric values:', values);

    if (!selectedColumn) {
      console.log('No numeric data found');
      return res.status(400).json({ error: 'No numeric data found' });
    }

    const mean = math.mean(values);
    const stdDev = math.std(values);
    const rsd = (stdDev / mean) * 100;

    
    const labels = values.map((_, i) => `Sample ${i + 1}`);
    const chartPath = `uploads/chart_${Date.now()}.png`;
    await generateLineChart(labels, values, `Raw Data: ${selectedColumn}`, chartPath);

    const chartBase64 = fs.readFileSync(chartPath, { encoding: 'base64' });

    res.json({
      column: selectedColumn,
      mean: mean.toFixed(2),
      stdDev: stdDev.toFixed(2),
      rsd: rsd.toFixed(2),
      count: values.length,
      chartImage: `data:image/png;base64,${chartBase64}`
    });
    // Log the action
   await Log.create({
    username: "admin", // or use req.user.username if you have auth
    action: "upload",
    filename: file.originalname
  });
  console.log(`File processed: ${file.originalname}`);
  // Clean up uploaded file
  fs.unlinkSync(filePath);
    
  } catch (err) {
    console.error('RawData error:', err);
    res.status(500).json({ error: err.message });
  }
  

};



// exports.processRawData = (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }
//     const filePath = path.join(__dirname, '..', file.path);
//     const ext = path.extname(file.originalname).toLowerCase();

//     let data;
//     if (ext === '.xlsx') {
//       const workbook = xlsx.readFile(filePath);
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       data = xlsx.utils.sheet_to_json(sheet);
//     } else if (ext === '.csv') {
//       //data = xlsx.utils.sheet_to_json(xlsx.readFile(filePath).Sheets['Sheet1']);
//       // If this fails, use:
//       const workbook = xlsx.readFile(filePath);
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       data = xlsx.utils.sheet_to_json(sheet);
//     } else {
//       return res.status(400).json({ error: 'Unsupported file type' });
//     }

//     if (!data || !data.length) {
//       return res.status(400).json({ error: 'No data found in file' });
//     }

//     const firstKey = Object.keys(data[0])[0];
//     const values = data.map(row => parseFloat(row[firstKey])).filter(n => !isNaN(n));

//     if (!values.length) {
//       return res.status(400).json({ error: 'No numeric data found' });
//     }

//     const mean = math.mean(values);
//     const stdDev = math.std(values);
//     const rsd = (stdDev / mean) * 100;

//     res.json({
//       column: firstKey,
//       mean: mean.toFixed(2),
//       stdDev: stdDev.toFixed(2),
//       rsd: rsd.toFixed(2),
//       count: values.length
//     });
//   } catch (err) {
//     console.error('RawData error:', err);
//     res.status(500).json({ error: err.message });
//   }
// };