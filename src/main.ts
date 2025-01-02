import * as d3 from 'd3';
import { drawSquares, drawCubicBezierTrianglesSymmetric } from './rendering';

const sizeMultiplier = 1.4;
const width = 800 * sizeMultiplier;
const height = 600 * sizeMultiplier;

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



// ===========================
// =======  TRIANGLES  =======
// ===========================

// Initialize Bézier curve degree with float value
let bezierDegree = 0.0;

// Initialize Control Point Distance as a percentage of size (default: 50%)
let controlPointDistancePercent = 50; 



// ========================
// =======  EVENTS  =======
// ========================

// Control Point Distance Slider event listener
document.getElementById('distanceSlider')?.addEventListener('input', (event) => {
  controlPointDistancePercent = parseInt((event.target as HTMLInputElement).value, 10); // Get percentage
  document.getElementById('distanceValue')!.textContent = `${controlPointDistancePercent}%`; // Update displayed value

  // Redraw the triangles with the updated control point distance
  drawShapes();
});

// Bézier curve degree slider event listener
document.getElementById('bezierSlider')?.addEventListener('input', (event) => {
  bezierDegree = parseFloat((event.target as HTMLInputElement).value); // Get the slider value as float
  document.getElementById('bezierValue')!.textContent = bezierDegree.toFixed(1); // Update displayed value

  // Redraw the triangles with the updated Bézier curve degree
  drawShapes();
});


// Set default shape to triangle
const shapeSwitch = document.getElementById('shapeSwitch') as HTMLSelectElement;
shapeSwitch.value = 'triangle';

// Initial draw: Triangles with default settings
drawCubicBezierTrianglesSymmetric(
  svg,
  width,
  height,
  size,
  bezierDegree,
  controlPointDistancePercent,
  getRandomColor,
  strokeWidth
);



// Shape switch event listener
document.getElementById('shapeSwitch')?.addEventListener('change', (event) => {
  drawShapes();
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
  drawShapes();
});

// Event listener for stroke width slider
document.getElementById('strokeSlider')?.addEventListener('input', (event) => {
  strokeWidth = parseInt((event.target as HTMLInputElement).value, 10); // Get stroke width value
  document.getElementById('strokeValue')!.textContent = strokeWidth.toString(); // Update displayed value

  // Redraw the current shape with the updated stroke width
  drawShapes();
});

const drawShapes = () => {
  const shape = (document.getElementById('shapeSwitch') as HTMLSelectElement).value;
  if (shape === 'square') {
    drawSquares(
      svg,
      width,
      height,
      size,
      getRandomColor,
      strokeWidth
    );
  } else if (shape === 'triangle') {
    drawCubicBezierTrianglesSymmetric(
      svg,
      width,
      height,
      size,
      bezierDegree,
      controlPointDistancePercent,
      getRandomColor,
      strokeWidth
    );
  }
};
