const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun,Header,Footer,ImageRun } = require('docx');
const askGemini = require('../utils/geminiService');
const Log = require('../models/Log');
const {exec}= require('child_process');
const User=require('../models/User'); // Assuming you have a User model for user data
const DocumentHistory=require('../models/History');
exports.processSTP = async (req, res) => {
  const userId = req.user?.userId; // assuming you decode JWT
  const user = await User.findById(userId);

  if (!user) return res.status(403).json({ msg: 'Unauthorized' });

  // Check download limit
  const now = new Date();
  const sameMonth = now.getMonth() === new Date(user.lastReset).getMonth();

  if (user.subscriptionPlan === 'Basic' && sameMonth && user.downloadsThisMonth >= 20) {
    return res.status(403).json({ msg: 'Download limit reached' });
  }

  // Update user download stats
  if (!sameMonth) {
    user.downloadsThisMonth = 1;
    user.lastReset = now;
  } else {
    user.downloadsThisMonth += 1;
  }

  await user.save();
  const stpFile = req.files?.stpFile?.[0];
  const logoFile = req.files?.logo?.[0];
  const { companyName, reviewer } = req.body;

  if (!stpFile) {
    return res.status(400).json({ error: 'No STP file uploaded' });
  }

  const filePath = path.join(__dirname, '..', stpFile.path);
  const logoPath = logoFile ? path.join(__dirname, '..', logoFile.path) : null;
  const originalName = path.parse(stpFile.originalname).name;
  const ext = path.extname(stpFile.originalname).toLowerCase();

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
     const now = new Date();
    const doc = new Document({
      sections: [

        {
          children: [
            ...(logoPath
              ? [new Paragraph({
                  children: [
                    new ImageRun({
                      data: fs.readFileSync(logoPath),
                      transformation: { width: 100, height: 100 }
                    })
                  ]
                })]
              : []),
            new Paragraph({ text: "PharmaDocs AI Report", heading: "Heading1" }),
            new Paragraph({ text: "AI-Generated Content", spacing: { before: 300 } }),
            ...(aiOutput.split('\n').map(line => new Paragraph(line)))
          ],
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: companyName || "PharmaDocs AI", bold: true })],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({ children: [new TextRun(`Reviewed by: ${reviewer || "N/A"}`)] }),
                new Paragraph({ text: `Generated: ${now.toLocaleDateString()}`, alignment: 'right' }),
              ],
            }),
          },
         
        },
      ],
    });
  // 1️⃣ Create DOCX
// const buffer = await Packer.toBuffer(doc);
// const docxPath = path.join(__dirname, '..', 'uploads', `report_${Date.now()}.docx`);
// fs.writeFileSync(docxPath, buffer);

// // 2️⃣ Convert to PDF
// const outputDir = path.resolve(__dirname, '..', 'uploads');
// const convertCommand = `libreoffice --headless --convert-to pdf "${docxPath}" --outdir "${outputDir}"`;

// exec(convertCommand, (error, stdout, stderr) => {
//   if (error) {
//     return res.status(500).json({ error: 'PDF conversion failed', details: stderr });
//   }

//   const pdfPath = docxPath.replace('.docx', '.pdf');

//   // Send only PDF to client
//   res.download(pdfPath, `PharmaDocs_Report.pdf`, (err) => {
//     if (err) console.error('❌ Error sending file:', err);

//     // Cleanup files
//     fs.unlinkSync(docxPath);
//     fs.unlinkSync(pdfPath);
//   });
// });

    const buffer = await Packer.toBuffer(doc);
  // const docxPath = `uploads/report_${Date.now()}.docx`;
  // fs.writeFileSync(docxPath, buffer);

  // Convert to PDF using LibreOffice CLI
 // const outputDir = path.resolve(__dirname, '..', 'uploads');
  // const convertCommand = `libreoffice --headless --convert-to pdf "${docxPath}" --outdir "${outputDir}"`;

  // exec(convertCommand, (error, stdout, stderr) => {
  //   if (error) {
  //     return res.status(500).json({ error: 'PDF conversion failed', details: stderr });
  //   }

  //   const pdfPath = docxPath.replace('.docx', '.pdf');
  //   res.download(pdfPath); // send the PDF file
  // });
    

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFileName = `PharmaDocs_${originalName}_${timestamp}.docx`;
    const outputPath = path.join(__dirname, '..', 'uploads', outputFileName);

    fs.writeFileSync(outputPath, buffer);
    // ...after fs.writeFileSync(outputPath, buffer); and before res.download...
await Log.create({
  username: "Admin",
  action: "generated",
  filename: outputFileName
});
await DocumentHistory.create({
  userId: req.user._id,
  username: req.user.username,
  filename: outputFileName,
  fileType: 'docx', // or detect from output
  module: req.body.module || 'Unknown'
});
    // 🧼 Delete uploaded file to clean up
    
     fs.unlinkSync(filePath);
    if (logoPath) fs.unlinkSync(logoPath);

    console.log(`✅ File processed and report generated: ${outputFileName}`);

    // 📤 Send the DOCX to client
    res.download(outputPath, outputFileName, (err) => {
      if (err) {
        console.error('❌ Error sending file:', err);
      }

      // Cleanup generated file after download
    //   fs.unlink(outputPath, (err) => {
    //     if (err) console.error('❌ Could not delete generated report:', err);
    //     else console.log(`🧹 Cleaned up report: ${outputFileName}`);
    //   });
    });

  } catch (err) {
    console.error('❌ Processing error:', err.message);
    res.status(500).json({ error: 'Internal Server Error. Please try again.' });
  }
};



