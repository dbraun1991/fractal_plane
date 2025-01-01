import * as d3 from 'd3';

const width = 800*1.4;
const height = 600*1.4;

// Create SVG container
const svg = d3
  .select('#app')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('border', '1px solid black');

// Define initial 'geometric shape' grid size
let size = 50;

// Function to get a random color from the new color palette
const getRandomColor = () => '#EEEEEE';

// Initialize stroke width
let strokeWidth = 1;

// =========================
// =======  SQUARES  =======
// =========================

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
        .attr('stroke', 'black')
        .attr('stroke-width', strokeWidth); // Apply dynamic stroke width
    }
  }
};




// ===========================
// =======  TRIANGLES  =======
// ===========================

// Initialize Bézier curve degree with float value
let bezierDegree = 0.0;

// Initialize Control Point Distance as a percentage of size (default: 50%)
let controlPointDistancePercent = 50; 

// Function to calculate actual distance from percentage
const calculateControlDistance = () => (controlPointDistancePercent / 100) * size;



// Function to draw cubic bezier triangles symmetrically
const drawCubicBezierTrianglesSymmetric = () => {
  svg.selectAll('*').remove(); // Clear existing content
  // fill whole svg with color dark blue as background color 
  svg.append('rect')
  .attr('width', width) // Full width of the SVG
  .attr('height', height) // Full height of the SVG
  .attr('fill', '#2C3E50'); // Dark blue color

  const halfSize = size / 2;
  const controlDistance = calculateControlDistance(); // Dynamically calculate distance
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
        .attr('stroke-width', strokeWidth)  // Apply dynamic stroke width
        .attr('fill', 'none');
      svg.append('path')
        .attr('d', `M${p2.x},${p2.y} C${controlsP2toP3.control1.x},${controlsP2toP3.control1.y} ${controlsP2toP3.control2.x},${controlsP2toP3.control2.y} ${p3.x},${p3.y}`)
        .attr('stroke', getRandomColor())
        .attr('stroke-width', strokeWidth)  // Apply dynamic stroke width
        .attr('fill', 'none');

      svg.append('path')
        .attr('d', `M${p3.x},${p3.y} C${controlsP3toP1.control1.x},${controlsP3toP1.control1.y} ${controlsP3toP1.control2.x},${controlsP3toP1.control2.y} ${p1.x},${p1.y}`)
        .attr('stroke', getRandomColor())
        .attr('stroke-width', strokeWidth)  // Apply dynamic stroke width
        .attr('fill', 'none');
    }
  }
};



// ========================
// =======  EVENTS  =======
// ========================

// Control Point Distance Slider event listener
document.getElementById('distanceSlider')?.addEventListener('input', (event) => {
  controlPointDistancePercent = parseInt((event.target as HTMLInputElement).value, 10); // Get percentage
  document.getElementById('distanceValue')!.textContent = `${controlPointDistancePercent}%`; // Update displayed value

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


// Set default shape to triangle
const shapeSwitch = document.getElementById('shapeSwitch') as HTMLSelectElement;
shapeSwitch.value = 'triangle';

// Initial draw: Triangles with default settings
drawCubicBezierTrianglesSymmetric();

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

// Event listener for stroke width slider
document.getElementById('strokeSlider')?.addEventListener('input', (event) => {
  strokeWidth = parseInt((event.target as HTMLInputElement).value, 10); // Get stroke width value
  document.getElementById('strokeValue')!.textContent = strokeWidth.toString(); // Update displayed value

  // Redraw the current shape with the updated stroke width
  const shape = (document.getElementById('shapeSwitch') as HTMLSelectElement).value;
  if (shape === 'square') {
    drawSquares();
  } else if (shape === 'triangle') {
    drawCubicBezierTrianglesSymmetric();
  }
});


