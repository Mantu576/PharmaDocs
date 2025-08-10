const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const askGemini = require('../utils/geminiService');
const Log = require('../models/Log');

exports.processSTP = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '..', file.path);
  const originalName = path.parse(file.originalname).name;
  const ext = path.extname(file.originalname).toLowerCase();

  try {
    let content;
    if (ext === '.txt') {
      content = fs.readFileSync(filePath, 'utf-8');
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      content = result.value;
    } else {
      throw new Error('Unsupported file type');
    }

    const prompt = `
You're a pharma documentation assistant. From the below STP content, extract:
- Objective
- Scope
- Key Parameters
- Pharmacopeia alignment (USP/IP/BP)

STP Content:
${content}
    `;


    // 🧠 Safe Gemini Call with Logging
    let aiOutput;
    try {
      aiOutput = await askGemini(prompt);
      console.log('✅ Gemini response received');
    } catch (geminiErr) {
      console.error('❌ Gemini API failed:', geminiErr);
      throw new Error('AI processing failed. Please try again later.');
    }

    // 📝 Build DOCX Report
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "PharmaDocs AI Report",
            heading: "Heading1",
          }),
          new Paragraph({
            text: "AI-Generated Summary",
            spacing: { before: 300 },
          }),
          ...aiOutput.split('\n').map(line =>
            new Paragraph({
              children: [new TextRun(line)],
            })
          ),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFileName = `PharmaDocs_${originalName}_${timestamp}.docx`;
    const outputPath = path.join(__dirname, '..', 'uploads', outputFileName);

    fs.writeFileSync(outputPath, buffer);
    // ...after fs.writeFileSync(outputPath, buffer); and before res.download...
await Log.create({
  username: "admin", // or use req.user.username if you have auth
  action: "generated",
  filename: outputFileName
});

    // 🧼 Delete uploaded file to clean up
    fs.unlinkSync(filePath);

    console.log(`✅ File processed and report generated: ${outputFileName}`);

    // 📤 Send the DOCX to client
    res.download(outputPath, outputFileName, (err) => {
      if (err) {
        console.error('❌ Error sending file:', err);
      }

      // Cleanup generated file after download
      fs.unlink(outputPath, (err) => {
        if (err) console.error('❌ Could not delete generated report:', err);
        else console.log(`🧹 Cleaned up report: ${outputFileName}`);
      });
    });

  } catch (err) {
    console.error('❌ Processing error:', err.message);
    res.status(500).json({ error: 'Internal Server Error. Please try again.' });
  }
};



