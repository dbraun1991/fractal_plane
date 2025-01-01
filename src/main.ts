import * as d3 from 'd3';

const width = 800;
const height = 600;

// Create SVG container
const svg = d3
  .select('#app')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('border', '1px solid black');

// Define grid size
const size = 50;

// Function to generate random colors
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to draw squares
const drawSquares = () => {
  svg.selectAll('*').remove(); // Clear existing content

  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', size)
        .attr('height', size)
        .attr('fill', getRandomColor())  // Random color
        .attr('stroke', 'black');
    }
  }
};

// Function to draw triangles
const drawTriangles = () => {
  svg.selectAll('*').remove(); // Clear existing content

  const halfSize = size / 2;
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      const points = [
        `${x},${y}`,
        `${x + size},${y}`,
        `${x + halfSize},${y + size}`
      ].join(' ');

      svg.append('polygon')
        .attr('points', points)
        .attr('fill', getRandomColor())  // Random color
        .attr('stroke', 'black');
    }
  }
};

// Initial draw: Squares by default
drawSquares();

// Shape switch event listener
document.getElementById('shapeSwitch')?.addEventListener('change', (event) => {
  const shape = (event.target as HTMLSelectElement).value;
  if (shape === 'square') {
    drawSquares();
  } else if (shape === 'triangle') {
    drawTriangles();
  }
});

// Export button event listener
document.getElementById('exportButton')?.addEventListener('click', () => {
  const svgContent = svg.node()?.outerHTML;
  if (svgContent) {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pattern.svg';
    a.click();
    URL.revokeObjectURL(url);
  }
});
