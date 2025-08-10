const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

const width = 800;  // px
const height = 400; // px
const chartCallback = (ChartJS) => {};

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

async function generateLineChart(labels, values, title, outputFilePath) {
  const config = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: title,
        data: values,
        fill: false,
        borderColor: 'blue',
        tension: 0.1
      }]
    }
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config);
  fs.writeFileSync(outputFilePath, imageBuffer);
}

module.exports = generateLineChart;
