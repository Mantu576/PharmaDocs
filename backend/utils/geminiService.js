// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function askGemini(prompt) {
//   const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   return response.text();
// }

// module.exports = askGemini;
require('dotenv').config(); // load .env at the top
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error('Gemini Error:', err.message || err);
    return 'Failed to generate response';
  }
}

module.exports = askGemini;
