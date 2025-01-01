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
const getRandomColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length)];


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
        .attr('fill', getRandomColor())  // Apply gradient color
        .attr('stroke', 'black');
    }
  }
};

// Initialize Bézier curve degree
let bezierDegree = 0;

// Function to draw triangles with Bézier curves
const drawBezierTriangles = () => {
  svg.selectAll('*').remove(); // Clear existing content

  const halfSize = size / 2;
  const curveFactor = bezierDegree / 50; // Normalizing the degree to range -1 to 1 for controlling curve intensity

  // Draw the triangles with Bézier curves
  for (let y = 0; y < height; y += size) {
    const shiftX = (Math.floor(y / size) % 2 !== 0) ? halfSize : 0;

    for (let x = 0; x < width; x += size) {
      // Triangle 1 (left part)
      const points1 = [
        `${x + shiftX},${y}`, // Start point
        `${x + size / 2 + shiftX},${y - curveFactor * size}`, // Control point (curved outwards)
        `${x + size / 2 + shiftX},${y + size + curveFactor * size}`, // Control point (curved outwards)
        `${x + size + shiftX},${y + size}` // End point
      ].join(' ');

      svg.append('path')
        .attr('d', `M${x + shiftX},${y} C${x + size / 2 + shiftX},${y - curveFactor * size} ${x + size / 2 + shiftX},${y + size + curveFactor * size} ${x + size + shiftX},${y + size}`)
        .attr('fill', 'none')
        .attr('stroke', getRandomColor())
        .attr('stroke-width', 2);

      // Triangle 2 (right part)
      const points2 = [
        `${x + halfSize + shiftX},${y + size}`, // Start point
        `${x + size + halfSize + shiftX},${y + size - curveFactor * size}`, // Control point
        `${x + size + halfSize + shiftX},${y - curveFactor * size}`, // Control point
        `${x + size + shiftX},${y}` // End point
      ].join(' ');

      svg.append('path')
        .attr('d', `M${x + halfSize + shiftX},${y + size} C${x + size + halfSize + shiftX},${y + size - curveFactor * size} ${x + size + halfSize + shiftX},${y - curveFactor * size} ${x + size + shiftX},${y}`)
        .attr('fill', 'none')
        .attr('stroke', getRandomColor())
        .attr('stroke-width', 2);
    }
  }
};

// Initial draw: Triangles with 0-degree curve
drawBezierTriangles();

// Bézier curve degree slider event listener
document.getElementById('bezierSlider')?.addEventListener('input', (event) => {
  bezierDegree = parseInt((event.target as HTMLInputElement).value, 10); // Get the slider value
  document.getElementById('bezierValue')!.textContent = bezierDegree.toString(); // Update displayed value

  // Redraw the triangles with the updated Bézier curve degree
  drawBezierTriangles();
});

// Initial draw: Squares by default
drawSquares();

// Shape switch event listener
document.getElementById('shapeSwitch')?.addEventListener('change', (event) => {
  const shape = (event.target as HTMLSelectElement).value;
  if (shape === 'square') {
    drawSquares();
  } else if (shape === 'triangle') {
    drawBezierTriangles();
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
    drawBezierTriangles();
  }
});


