import * as d3 from 'd3';

const width = 400;
const height = 300;

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
const colorPalette = [
  '#D3D3D3', // Light Gray
  '#A4C8E1', // Light Blue
  '#7FB3D5', // Soft Blue
  '#5DADE2', // Sky Blue
  '#48C9B0', // Light Teal
  '#1ABC9C', // Strong Teal
  '#16A085', // Dark Teal
  '#2ECC71', // Light Green
  '#27AE60', // Green
  '#1F8E3B', // Mature Green
  '#17B6A2', // Aqua Green
  '#16A085', // Dark Teal
  '#1F3A3D', // Dark Cyan
  '#2C3E50', // Dark Blue
  '#34495E', // Steel Blue
  '#2980B9', // Bright Blue
  '#2E86C1', // Soft Blue
  '#3498DB', // Vivid Blue
  '#5DADE2', // Bright Sky Blue
  '#1F8E3B', // Mature Green
  '#000000'  // Black
];

// Function to get a random color from the new color palette
const getRandomColor = () => '#2C3E50';
//colorPalette[Math.floor(Math.random() * colorPalette.length/2)+8];


// Function to draw squares
const drawSquares = () => {
  svg.selectAll('*').remove(); // Clear existing content

  for (let x = 50; x < width; x += size) {
    for (let y = 50; y < height; y += size) {
      svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', size)
        .attr('height', size)
        .attr('fill', getRandomColor())  // Apply gradient color
        .attr('stroke', 'black');
    }
  }
};

// Initialize Bézier curve degree with float value
let bezierDegree = 0.0;

// Initialize distance (default is 50)
let controlPointDistance = 50;

// Initialize segment curvatures (default is 50)
let firstSegmentCurvature = 50;  // First segment: Top-left to Top-right
let secondSegmentCurvature = 50; // Second segment: Top-right to Bottom

const drawCubicBezierTrianglesSymmetric = () => {
  svg.selectAll('*').remove(); // Clear existing content

  const halfSize = size / 2;
  const controlDistance = controlPointDistance; // From slider
  const controlDegree = (bezierDegree * Math.PI) / 180; // Convert degrees to radians

  for (let y = 0; y < height; y += size) {
    const shiftX = (Math.floor(y / size) % 2 !== 0) ? halfSize : 0;

    for (let x = 0; x < width; x += size) {
      // Define the triangle vertices
      const p1 = { x: x + shiftX, y: y }; // Top-left
      const p2 = { x: x + size + shiftX, y: y }; // Top-right
      const p3 = { x: x + halfSize + shiftX, y: y + size }; // Bottom

      // Calculate control points for each segment
      const controlP1toP2_1 = {
        x: p1.x + controlDistance * Math.cos(controlDegree),
        y: p1.y + controlDistance * Math.sin(controlDegree),
      };
      const controlP1toP2_2 = {
        x: p2.x - controlDistance * Math.cos(controlDegree),
        y: p2.y - controlDistance * Math.sin(controlDegree),
      };

      const controlP2toP3_1 = {
        x: p2.x + controlDistance * Math.cos(controlDegree),
        y: p2.y + controlDistance * Math.sin(controlDegree),
      };
      const controlP2toP3_2 = {
        x: p3.x - controlDistance * Math.cos(controlDegree),
        y: p3.y - controlDistance * Math.sin(controlDegree),
      };

      const controlP3toP1_1 = {
        x: p3.x + controlDistance * Math.cos(controlDegree),
        y: p3.y + controlDistance * Math.sin(controlDegree),
      };
      const controlP3toP1_2 = {
        x: p1.x - controlDistance * Math.cos(controlDegree),
        y: p1.y - controlDistance * Math.sin(controlDegree),
      };

      // Draw the cubic Bézier curves
      svg.append('path')
        .attr('d', `M${p1.x},${p1.y} C${controlP1toP2_1.x},${controlP1toP2_1.y} ${controlP1toP2_2.x},${controlP1toP2_2.y} ${p2.x},${p2.y}`)
        .attr('stroke', getRandomColor())
        .attr('fill', 'none');

      svg.append('path')
        .attr('d', `M${p2.x},${p2.y} C${controlP2toP3_1.x},${controlP2toP3_1.y} ${controlP2toP3_2.x},${controlP2toP3_2.y} ${p3.x},${p3.y}`)
        .attr('stroke', getRandomColor())
        .attr('fill', 'none');

      svg.append('path')
        .attr('d', `M${p3.x},${p3.y} C${controlP3toP1_1.x},${controlP3toP1_1.y} ${controlP3toP1_2.x},${controlP3toP1_2.y} ${p1.x},${p1.y}`)
        .attr('stroke', getRandomColor())
        .attr('fill', 'none');
    }
  }
};

// Control Point Distance Slider event listener
document.getElementById('distanceSlider')?.addEventListener('input', (event) => {
  controlPointDistance = parseInt((event.target as HTMLInputElement).value, 10); // Get the slider value
  document.getElementById('distanceValue')!.textContent = controlPointDistance.toString(); // Update displayed value

  // Redraw the triangles with the updated control point distance
  drawCubicBezierTrianglesSymmetric();
});

// Bézier curve degree slider event listener
document.getElementById('bezierSlider')?.addEventListener('input', (event) => {
  bezierDegree = parseFloat((event.target as HTMLInputElement).value); // Get the slider value as float
  document.getElementById('bezierValue')!.textContent = bezierDegree.toFixed(1); // Update displayed value

  // Redraw the triangles with the updated Bézier curve degree
  drawCubicBezierTrianglesSymmetric();
});


// Initial draw: Triangles with 0-degree curve
drawCubicBezierTrianglesSymmetric();

// Initial draw: Squares by default
drawSquares();

// Shape switch event listener
document.getElementById('shapeSwitch')?.addEventListener('change', (event) => {
  const shape = (event.target as HTMLSelectElement).value;
  if (shape === 'square') {
    drawSquares();
  } else if (shape === 'triangle') {
    drawCubicBezierTrianglesSymmetric();
  }
});

// Export button event listener
document.getElementById('exportButton')?.addEventListener('click', () => {
  const svgContent = svg.node()?.outerHTML;
  if (svgContent) {
    // Ensure the svg content is properly formatted with style information
    const svgWithStyles = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" style="border: 1px solid black;">${svgContent}</svg>`;

    const blob = new Blob([svgWithStyles], { type: 'image/svg+xml' });
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
    drawCubicBezierTrianglesSymmetric();
  }
});


