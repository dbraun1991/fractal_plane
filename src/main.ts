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
  const controlDegreeAdjustment = (bezierDegree * Math.PI) / 180; // Convert slider degree to radians

  for (let y = 0; y < height; y += size) {
    const shiftX = (Math.floor(y / size) % 2 !== 0) ? halfSize : 0;

    for (let x = 0; x < width; x += size) {
      // Define the triangle vertices
      const p1 = { x: x + shiftX, y: y }; // Top-left
      const p2 = { x: x + size + shiftX, y: y }; // Top-right
      const p3 = { x: x + halfSize + shiftX, y: y + size }; // Bottom

      // Function to calculate control points with adjusted angle
      const calculateControlPoints = (start: { x: number; y: number }, end: { x: number; y: number }) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const defaultDegree = Math.atan2(dy, dx); // Angle of the line segment
        const finalDegree1 = defaultDegree + controlDegreeAdjustment; // Adjusted angle for first control point
        const finalDegree2 = defaultDegree - controlDegreeAdjustment; // Adjusted angle for second control point (inverted)

        return {
          control1: {
            x: start.x + controlDistance * Math.cos(finalDegree1),
            y: start.y + controlDistance * Math.sin(finalDegree1),
          },
          control2: {
            x: end.x - controlDistance * Math.cos(finalDegree1), // Invert the direction for symmetry
            y: end.y - controlDistance * Math.sin(finalDegree1),
          },
        };
      };

      // Calculate control points for each segment
      const controlsP1toP2 = calculateControlPoints(p1, p2);
      const controlsP2toP3 = calculateControlPoints(p2, p3);
      const controlsP3toP1 = calculateControlPoints(p3, p1);

      // Draw the cubic Bézier curves
      svg.append('path')
        .attr('d', `M${p1.x},${p1.y} C${controlsP1toP2.control1.x},${controlsP1toP2.control1.y} ${controlsP1toP2.control2.x},${controlsP1toP2.control2.y} ${p2.x},${p2.y}`)
        .attr('stroke', getRandomColor())
        .attr('fill', 'none');

      svg.append('path')
        .attr('d', `M${p2.x},${p2.y} C${controlsP2toP3.control1.x},${controlsP2toP3.control1.y} ${controlsP2toP3.control2.x},${controlsP2toP3.control2.y} ${p3.x},${p3.y}`)
        .attr('stroke', getRandomColor())
        .attr('fill', 'none');

      svg.append('path')
        .attr('d', `M${p3.x},${p3.y} C${controlsP3toP1.control1.x},${controlsP3toP1.control1.y} ${controlsP3toP1.control2.x},${controlsP3toP1.control2.y} ${p1.x},${p1.y}`)
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


