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

// Define initial grid size
let size = 50;

// Create five monochromatic gradients from light gray to dark gray
const grayScale = ['#D3D3D3', '#A9A9A9', '#808080', '#696969', '#2F4F4F']; // Light to dark gray

// Function to get a gradient color for the shapes
const getGradientColor = (index: number) => grayScale[index % grayScale.length];

// Function to draw squares
const drawSquares = () => {
  svg.selectAll('*').remove(); // Clear existing content

  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      const gradientIndex = Math.floor(Math.random() * grayScale.length);
      svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', size)
        .attr('height', size)
        .attr('fill', getGradientColor(gradientIndex))  // Apply gradient color
        .attr('stroke', 'black');
    }
  }
};

// Function to draw triangles with staggered lines
const drawTriangles = () => {
  svg.selectAll('*').remove(); // Clear existing content

  const halfSize = size / 2;

  for (let y = 0; y < height; y += size) {
    // Determine the shift for every second row (odd rows only)
    const shiftX = (Math.floor(y / size) % 2 !== 0) ? halfSize : 0;

    for (let x = 0; x < width; x += size) {
      const points = [
        `${x + shiftX},${y}`,
        `${x + size + shiftX},${y}`,
        `${x + halfSize + shiftX},${y + size}`
      ].join(' ');

      svg.append('polygon')
        .attr('points', points)
        .attr('fill', getGradientColor(Math.floor(Math.random() * grayScale.length)))  // Apply gradient color
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

// Slider event listener to update grid size
const sizeSlider = document.getElementById('sizeSlider') as HTMLInputElement;
const sizeValue = document.getElementById('sizeValue') as HTMLSpanElement;

sizeSlider.addEventListener('input', (event) => {
  size = parseInt((event.target as HTMLInputElement).value, 10); // Get the slider value
  sizeValue.textContent = size.toString(); // Update displayed size

  // Redraw the pattern with the new size
  const shape = (document.getElementById('shapeSwitch') as HTMLSelectElement).value;
  if (shape === 'square') {
    drawSquares();
  } else if (shape === 'triangle') {
    drawTriangles();
  }
});
