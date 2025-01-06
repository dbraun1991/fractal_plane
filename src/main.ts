import * as d3 from 'd3';
import './styles/styles.css';

import { drawSquares, drawCubicBezierSquaresSymmetric } from './square';
import { drawCubicBezierTrianglesSymmetric } from './triangle';
import { drawSingleBezierCurve } from './curve';

const sizeMultiplier = 0.9;
const width = 800 * sizeMultiplier;
const height = 600 * sizeMultiplier;

const orderOptions: { [key in "singleCurve" | "triangle" | "square"]: string[] } = {
  singleCurve: ["flooded"],
  triangle: ["flooded", "rhomb"],
  square: ["flooded", "cube"],
};

// Create SVG container
const svg = d3
  .select('#app')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('border', '1px solid black');

// Define initial 'geometric shape' grid size
let size = 50;

// Initialize stroke width
let strokeWidth = 2;

// Initialize symmetry toggle
let isSymmetric = true;

// Initialize gradient reduction toggle
let isGradientReduction = false;


// ===========================
// =======  TRIANGLES  =======
// ===========================

// Initialize Bézier curve degree with float value
let bezierDegree = 0.0;
let bezierDegreeReduction = 0.0;

// Initialize Control Point Distance as a percentage of size (default: 50%)
let controlPointDistancePercent = 50; 
let controlPointDistanceReduction = 0.0;

// Color settings
let baseStrokeColor = '#EEEEEE'; // Initial stroke color (default: black)
let baseBackgroundColor = '#2C3E50'; // Initial background color (default: white)
let gradientEnabled = false; // Gradient toggle state
let gradientColor = '#EEEEEE'; // Initial gradient color


// ====================================
// =======  BasicEffect-Events  =======
// ====================================

// Slider event listener to update grid size
const sizeSlider = document.getElementById('sizeSlider') as HTMLInputElement;
const sizeValue = document.getElementById('sizeValue') as HTMLSpanElement;

sizeSlider.addEventListener('input', (event) => {
  size = parseInt((event.target as HTMLInputElement).value, 10); // Get the slider value
  sizeValue.textContent = size.toString(); // Update displayed size

  // Redraw the pattern with the new size
  drawShapes();
});

// Shape switch event listener
document.getElementById('shapeSwitch')?.addEventListener('change', (event) => {
  const shape = (event.target as HTMLSelectElement).value;
  const orderSwitch = document.getElementById('orderSwitch') as HTMLSelectElement;

  if (shape in orderOptions) {
    // Clear existing options in orderSwitch
    while (orderSwitch.options.length > 0) {
      orderSwitch.remove(0);
    }

    // Add new options based on the selected shape
    const options = orderOptions[shape as keyof typeof orderOptions];
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option.charAt(0).toUpperCase() + option.slice(1); // Capitalize first letter
      orderSwitch.appendChild(opt);
    });

    // Set default value to 'flooded'
    orderSwitch.value = "flooded";

    // Redraw shapes
    drawShapes();
  }
});

// Event listener for stroke width slider
document.getElementById('strokeSlider')?.addEventListener('input', (event) => {
  strokeWidth = parseInt((event.target as HTMLInputElement).value, 10); // Get stroke width value
  document.getElementById('strokeValue')!.textContent = strokeWidth.toString(); // Update displayed value

  // Redraw the current shape with the updated stroke width
  drawShapes();
});


// ===============================
// =======  Bezier-Events  =======
// ===============================

document.getElementById('symmetricToggle')?.addEventListener('change', (event) => {
  isSymmetric = (event.target as HTMLInputElement).checked; // Get checkbox state
  // Redraw shapes based on updated symmetry state
  drawShapes();
});

// Bézier curve degree slider event listener
document.getElementById('bezierSlider')?.addEventListener('input', (event) => {
  bezierDegree = parseFloat((event.target as HTMLInputElement).value); // Get the slider value as float
  document.getElementById('bezierValue')!.textContent = bezierDegree.toFixed(1); // Update displayed value

  // Redraw the triangles with the updated Bézier curve degree
  drawShapes();
});

// Control Point Distance Slider event listener
document.getElementById('distanceSlider')?.addEventListener('input', (event) => {
  controlPointDistancePercent = parseInt((event.target as HTMLInputElement).value, 10); // Get percentage
  document.getElementById('distanceValue')!.textContent = `${controlPointDistancePercent}%`; // Update displayed value

  // Redraw the triangles with the updated control point distance
  drawShapes();
});


// ========================================
// =======  Bezier-Gradient-Events  =======
// ========================================

document.getElementById('gradientReductionToggle')?.addEventListener('change', (event) => {
  isGradientReduction = (event.target as HTMLInputElement).checked; // Get checkbox state
  // Redraw shapes based on updated gradient reduction state
  drawShapes();
});

// Gradient Reduction of Bézier Curve Degree
document.getElementById('bezierReductionSlider')?.addEventListener('input', (event) => {
  bezierDegreeReduction = parseFloat((event.target as HTMLInputElement).value); // Get the slider value as float
  document.getElementById('bezierReductionValue')!.textContent = `${bezierDegreeReduction}%`; // Update displayed value

  // Redraw the triangles with the updated Bézier curve degree
  drawShapes();
});

// Gradient Reduction of Control Point Distance
document.getElementById('distanceReductionSlider')?.addEventListener('input', (event) => {
  controlPointDistanceReduction = parseFloat((event.target as HTMLInputElement).value); // Get percentage
  document.getElementById('distanceReductionValue')!.textContent = `${controlPointDistanceReduction}%`; // Update displayed value

  // Redraw the triangles with the updated control point distance
  drawShapes();
});


// ==============================
// =======  Color-Events  =======
// ==============================

// Event listener for base stroke color picker
document.getElementById('baseStrokeColor')?.addEventListener('input', (event) => {
  const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
  baseStrokeColor = inputElement.value; // Safe access to value
  const textElement = document.getElementById('baseStrokeColorText') as HTMLInputElement; // Cast to HTMLInputElement
  textElement.value = baseStrokeColor; // Sync with text field

  // Redraw the shape with the new base stroke color
  drawShapes();
});


// Event listener for base stroke color text field
document.getElementById('baseStrokeColorText')?.addEventListener('input', (event) => {
  baseStrokeColor = (event.target as HTMLInputElement).value; // Get text field value
  const colorPicker = document.getElementById('baseStrokeColor') as HTMLInputElement;
  colorPicker.value = baseStrokeColor; // Sync with color picker

  // Redraw the shape with the new base stroke color
  drawShapes();
});

// Event listener for base background color picker
document.getElementById('baseBackgroundColor')?.addEventListener('input', (event) => {
  const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
  baseBackgroundColor = inputElement.value; // Get color picker value
  const textElement = document.getElementById('baseBackgroundColorText') as HTMLInputElement; // Cast to HTMLInputElement
  textElement.value = baseBackgroundColor; // Sync with text field

  // Redraw the shape with the new background color
  drawShapes();
});

// Event listener for base background color text field
document.getElementById('baseBackgroundColorText')?.addEventListener('input', (event) => {
  baseBackgroundColor = (event.target as HTMLInputElement).value; // Get text field value
  const colorPicker = document.getElementById('baseBackgroundColor') as HTMLInputElement; // Cast to HTMLInputElement
  colorPicker.value = baseBackgroundColor; // Sync with color picker

  // Redraw the shape with the new background color
  drawShapes();
});

// Event listener for gradient toggle
document.getElementById('gradientToggle')?.addEventListener('change', (event) => {
  gradientEnabled = (event.target as HTMLInputElement).checked; // Get checkbox state

  // Redraw the shape with the new gradient toggle state
  drawShapes();
});

// Event listener for gradient color picker
document.getElementById('gradientColor')?.addEventListener('input', (event) => {
  const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
  gradientColor = inputElement.value; // Get color picker value
  const textElement = document.getElementById('gradientColorText') as HTMLInputElement; // Cast to HTMLInputElement
  textElement.value = gradientColor; // Sync with text field

  // Redraw the shape with the new gradient color
  drawShapes();
});

// Event listener for gradient color text field
document.getElementById('gradientColorText')?.addEventListener('input', (event) => {
  gradientColor = (event.target as HTMLInputElement).value; // Get text field value
  const colorPicker = document.getElementById('gradientColor') as HTMLInputElement; // Cast to HTMLInputElement
  colorPicker.value = gradientColor; // Sync with color picker

  // Redraw the shape with the new gradient color
  drawShapes();
});


// ==============================
// =======  Export-Event  =======
// ==============================

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


// =============================
// =======  Draw-Events  =======
// =============================

const prepareBackground = () => {
  // Optionally apply gradient if enabled
  if (gradientEnabled) {
    // Ensure the gradient is added only once
    const gradientId = 'grad1';
    const existingGradient = svg.select(`#${gradientId}`);

    // Remove existing gradient if it exists, and create a new one
    if (existingGradient.empty()) {
      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%') // Start at the upper-left corner
        .attr('y1', '0%')
        .attr('x2', '100%') // End at the right (horizontal gradient)
        .attr('y2', '100%'); // Bottom (vertical gradient)

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', baseBackgroundColor)  // Dark blue or the user-selected background color
        .attr('stop-opacity', 1);

      gradient.append('stop')
        .attr('offset', '150%')
        .attr('stop-color', gradientColor)  // Light gray or the user-selected gradient color
        .attr('stop-opacity', 1);
    }

    // Apply the gradient as the background
    svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', `url(#${gradientId})`);
    
  } else {
    // If no gradient is selected, just apply the solid background color
    svg.style('background-color', baseBackgroundColor);
  }
};

svg.selectAll('*').remove();

prepareBackground();

// Initial draw: Triangles with default settings
drawCubicBezierTrianglesSymmetric(
  svg,
  width,
  height,
  size,
  bezierDegree,
  controlPointDistancePercent,
  baseStrokeColor,
  strokeWidth,
  isSymmetric,
  bezierDegreeReduction,
  controlPointDistanceReduction
);

const drawShapes = () => {
  const shape = (document.getElementById('shapeSwitch') as HTMLSelectElement).value;

  svg.selectAll('*').remove();

  prepareBackground();

  if (shape === 'square') {
    if (isSymmetric) {
      drawCubicBezierSquaresSymmetric(
        svg,
        width,
        height,
        size,
        bezierDegree,
        controlPointDistancePercent,
        baseStrokeColor,
        strokeWidth,
        bezierDegreeReduction,
        controlPointDistanceReduction
      );
    } else {
      drawSquares(
        svg,
        width,
        height,
        size,
        bezierDegree,
        controlPointDistancePercent,
        baseStrokeColor,
        strokeWidth
      );
    }
  } else if (shape === 'triangle') {
    drawCubicBezierTrianglesSymmetric(
      svg,
      width,
      height,
      size,
      bezierDegree,
      controlPointDistancePercent,
      baseStrokeColor,
      strokeWidth,
      isSymmetric,
      bezierDegreeReduction,
      controlPointDistanceReduction
    );
  } else if (shape === 'singleCurve') {
    drawSingleBezierCurve(
      svg,
      width,
      height,
      bezierDegree,
      controlPointDistancePercent,
      () => baseStrokeColor,
      strokeWidth,
      prepareBackground,
      isSymmetric
    );
  }
};
