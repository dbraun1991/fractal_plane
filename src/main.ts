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
const getRandomColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length/2)+8];


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


// Function to draw triangles with Bézier curves on each side
const drawBezierTriangles = () => {
  svg.selectAll('*').remove(); // Clear existing content

  const halfSize = size / 2;
  const curveFactor = bezierDegree / 50; // Normalizing the degree to range -1 to 1 for controlling curve intensity

  // Draw the triangles with Bézier curves on each side
  for (let y = 0; y < height; y += size) {
    const shiftX = (Math.floor(y / size) % 2 !== 0) ? halfSize : 0;

    for (let x = 0; x < width; x += size) {
      // Define the 3 vertices of the triangle
      const p1 = { x: x + shiftX, y: y }; // Top-left vertex
      const p2 = { x: x + size + shiftX, y: y }; // Top-right vertex
      const p3 = { x: x + halfSize + shiftX, y: y + size }; // Bottom vertex

      // Calculate control points for Bézier curves (opposite directions based on bezierDegree)
      const control1 = { x: p1.x + curveFactor * size, y: p1.y - curveFactor * size }; // Control point for p1 to p2
      const control2 = { x: p2.x - curveFactor * size, y: p2.y - curveFactor * size }; // Control point for p2 to p1

      const control3 = { x: p2.x + curveFactor * size, y: p2.y + curveFactor * size }; // Control point for p2 to p3
      const control4 = { x: p3.x - curveFactor * size, y: p3.y + curveFactor * size }; // Control point for p3 to p2

      const control5 = { x: p3.x + curveFactor * size, y: p3.y - curveFactor * size }; // Control point for p3 to p1
      const control6 = { x: p1.x - curveFactor * size, y: p1.y + curveFactor * size }; // Control point for p1 to p3

      // Draw the three Bézier curves that form the triangle
      svg.append('path')
        .attr('d', `M${p1.x},${p1.y} C${control1.x},${control1.y} ${control2.x},${control2.y} ${p2.x},${p2.y}`)
        .attr('fill', 'none')
        .attr('stroke', getRandomColor())
        .attr('stroke-width', 2);

      svg.append('path')
        .attr('d', `M${p2.x},${p2.y} C${control3.x},${control3.y} ${control4.x},${control4.y} ${p3.x},${p3.y}`)
        .attr('fill', 'none')
        .attr('stroke', getRandomColor())
        .attr('stroke-width', 2);

      svg.append('path')
        .attr('d', `M${p3.x},${p3.y} C${control5.x},${control5.y} ${control6.x},${control6.y} ${p1.x},${p1.y}`)
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


