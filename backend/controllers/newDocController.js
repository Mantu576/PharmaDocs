const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const math = require('mathjs');
const { Document, Packer, Paragraph, TextRun, Header, Footer } = require('docx');
const { exec } = require('child_process');
const askGemini = require('../utils/geminiService');
const generateLineChart = require('../utils/chartService');
const DocumentHistory = require('../models/History');
const DocLog = require('../models/Log');

// Utility: extract text from docx/txt
async function extractStpText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.docx') {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  }
  return fs.readFileSync(filePath, 'utf-8');
}

// Utility: parse first numeric column and stats + chart (base64)
async function analyzeRawData(filePath) {
  if (!filePath) return null;
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  if (!data.length) return null;
  const firstKey = Object.keys(data[0])[0];
  const values = data.map(r => parseFloat(r[firstKey])).filter(v => !isNaN(v));
  if (!values.length) return null;
  const mean = math.mean(values);
  const std = math.std(values);
  const rsd = (std / mean) * 100;
  const labels = values.map((_, i) => `Sample ${i + 1}`);
  const chartPath = `uploads/chart_${Date.now()}.png`;
  await generateLineChart(labels, values, `Raw Data: ${firstKey}`, chartPath);
  const chartBase64 = fs.readFileSync(chartPath, { encoding: 'base64' });
  return {
    column: firstKey,
    count: values.length,
    mean: Number(mean.toFixed(4)),
    stdDev: Number(std.toFixed(4)),
    rsd: Number(rsd.toFixed(4)),
    chartBase64: `data:image/png;base64,${chartBase64}`,
    values,
  };
}

function hasModuleAccess(user, module) {
  return (user.modulesAllowed || []).includes(module);
}

exports.previewNewDoc = async (req, res) => {
  try {
    const { module, docType, companyName, companyAddress, date, reviewer, checker, analyst } = req.body;
    if (!module || !docType) return res.status(400).json({ msg: 'module and docType are required' });
    if (!hasModuleAccess(req.user, module)) return res.status(403).json({ msg: 'Module not allowed for your plan' });
    console.log(req.user, req.body.module);
    const stpPath = req.files?.stpFile?.[0]?.path;
    const rawPath = req.files?.rawData?.[0]?.path;
   // const logoPath = req.files?.logo?.[0]?.path;

    const stpText = stpPath ? await extractStpText(stpPath) : '';
    const rawPreview = rawPath ? await analyzeRawData(rawPath) : null;

    const prompt = `You are a pharma documentation assistant. Prepare a ${docType} for module ${module} using the STP content below.\nReturn JSON with keys: objective, scope, methodSummary, compliance (USP/IP/BP), missingFields (array), warnings (array), notes.\nSTP Content:\n${stpText}`;
    const aiText = await askGemini(prompt);
    let ai;
    try {
      ai = JSON.parse(aiText);
    } catch (e) {
      ai = { raw: aiText };
    }

    return res.json({
      preview: {
        module,
        docType,
        header: { companyName, companyAddress, date },
        footer: { reviewer, checker, analyst },
        ai,
        rawPreview,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Preview failed', error: err.message });
  }
};

exports.commitNewDoc = async (req, res) => {
  try {
    const { preview } = req.body;
    if (!preview) return res.status(400).json({ msg: 'preview payload required' });
    if (!hasModuleAccess(req.user, preview.module)) return res.status(403).json({ msg: 'Module not allowed for your plan' });

    const now = new Date();
    const sameMonth = now.getMonth() === new Date(req.user.lastReset || now).getMonth();
    if (req.user.subscriptionPlan === 'Basic' && sameMonth && (req.user.downloadsThisMonth || 0) >= 20) {
      return res.status(403).json({ msg: 'Monthly download limit reached for Basic plan' });
    }

    const { module, docType, header, footer, ai, rawPreview } = preview;
    const docChildren = [];
    docChildren.push(new Paragraph({ text: `PharmaDocs AI — ${docType}`, heading: 'Heading1' }));
    if (ai?.objective) docChildren.push(new Paragraph({ text: `Objective: ${ai.objective}` }));
    if (ai?.scope) docChildren.push(new Paragraph({ text: `Scope: ${ai.scope}` }));
    if (ai?.methodSummary) docChildren.push(new Paragraph({ text: `Method Summary: ${ai.methodSummary}` }));
    if (ai?.compliance) docChildren.push(new Paragraph({ text: `Compliance: ${ai.compliance}` }));
    if (ai?.notes) docChildren.push(new Paragraph({ text: `Notes: ${ai.notes}` }));
    if (ai?.raw) docChildren.push(new Paragraph(new TextRun({ text: ai.raw })));

    if (rawPreview) {
      docChildren.push(new Paragraph({ text: '--- Raw Data Stats ---' }));
      docChildren.push(new Paragraph({ text: `Column: ${rawPreview.column}` }));
      docChildren.push(new Paragraph({ text: `Count: ${rawPreview.count}` }));
      docChildren.push(new Paragraph({ text: `Mean: ${rawPreview.mean}` }));
      docChildren.push(new Paragraph({ text: `Std Dev: ${rawPreview.stdDev}` }));
      docChildren.push(new Paragraph({ text: `%RSD: ${rawPreview.rsd}` }));
    }

    const doc = new Document({
      sections: [
        {
          headers: {
            default: new Header({
              children: [
                new Paragraph({ children: [ new TextRun({ text: header?.companyName || 'PharmaDocs AI', bold: true }) ] }),
                new Paragraph({ text: header?.companyAddress || '' })
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({ text: `Reviewer: ${footer?.reviewer || 'N/A'} | Checker: ${footer?.checker || 'N/A'} | Analyst: ${footer?.analyst || 'N/A'}` }),
                new Paragraph({ text: `Generated: ${new Date().toLocaleDateString()}` })
              ],
            }),
          },
          children: docChildren,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const baseName = `doc_${Date.now()}_${module}_${docType}`.replace(/\s+/g, '_');
    const docxPath = `uploads/${baseName}.docx`;
    fs.writeFileSync(docxPath, buffer);

    const outputDir = path.resolve(__dirname, '..', 'uploads');
    const convertCmd = `libreoffice --headless --convert-to pdf "${docxPath}" --outdir "${outputDir}"`;
    let pdfPath = null;
    await new Promise(resolve => {
      exec(convertCmd, (error) => {
        if (!error) pdfPath = docxPath.replace('.docx', '.pdf');
        resolve();
      });
    });

    // Optional: generate Excel raw data sheet when rawPreview exists
    let xlsxOut = null;
    if (rawPreview?.values?.length) {
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.aoa_to_sheet([
        ['Index', rawPreview.column],
        ...rawPreview.values.map((v, i) => [i + 1, v])
      ]);
      xlsx.utils.book_append_sheet(wb, ws, 'RawData');
      xlsxOut = `uploads/${baseName}.xlsx`;
      xlsx.writeFile(wb, xlsxOut);
    }

    // Log & history
    await DocumentHistory.create({
      userId: req.user._id,
      username: req.user.username,
      filename: path.basename(docxPath),
      fileType: 'docx',
      module,
    });
    await DocLog.create({ username: req.user.username, action: 'generated', filename: path.basename(docxPath) });
    if (pdfPath) {
      await DocumentHistory.create({ userId: req.user._id, username: req.user.username, filename: path.basename(pdfPath), fileType: 'pdf', module });
    }
    if (xlsxOut) {
      await DocumentHistory.create({ userId: req.user._id, username: req.user.username, filename: path.basename(xlsxOut), fileType: 'xlsx', module });
    }

    // Increment monthly downloads for Basic plan
    const now2 = new Date();
    const sameMonth2 = now2.getMonth() === new Date(req.user.lastReset || now2).getMonth();
    if (!sameMonth2) {
      req.user.downloadsThisMonth = 1;
      req.user.lastReset = now2;
    } else {
      req.user.downloadsThisMonth = (req.user.downloadsThisMonth || 0) + 1;
    }
    await req.user.save();

    res.json({
      ok: true,
      downloads: {
        docx: `/uploads/${path.basename(docxPath)}`,
        pdf: pdfPath ? `/uploads/${path.basename(pdfPath)}` : null,
        xlsx: xlsxOut ? `/uploads/${path.basename(xlsxOut)}` : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Commit failed', error: err.message });
  }
};