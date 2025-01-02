import * as d3 from 'd3';



// ==============================
// =======  SINGLE CURVE  =======
// ==============================

// Function to draw a single Bézier curve
// Function to draw a single Bézier curve with degree and background
export const drawSingleBezierCurve = (
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    width: number,
    height: number,
    bezierDegree: number,
    controlPointOffsetPercent: number,
    getRandomColor: () => string,
    strokeWidth: number
  ) => {
    svg.selectAll('*').remove(); // Clear existing content
  
    // Set the dark blue background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#2C3E50');
  
    const padding = 0.1 * width; // 10% padding
    const startPoint = { x: padding, y: height / 2 }; // Left anchor point
    const endPoint = { x: width - padding, y: height / 2 }; // Right anchor point
    const controlOffset = controlPointOffsetPercent / 100 * height; // Control offset based on percentage of height
  
    // Calculate the angle adjustment based on the Bézier degree
    const angleAdjustment = (bezierDegree * Math.PI) / 180;
  
    // Calculate control points using the degree and offset
    const controlPoint1 = {
      x: startPoint.x + controlOffset * Math.cos(angleAdjustment),
      y: startPoint.y - controlOffset * Math.sin(angleAdjustment),
    };
  
    const controlPoint2 = {
      x: endPoint.x - controlOffset * Math.cos(angleAdjustment),
      y: endPoint.y + controlOffset * Math.sin(angleAdjustment),
    };
  
    // Draw the Bézier curve
    svg.append('path')
      .attr('d', `M${startPoint.x},${startPoint.y} C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${endPoint.x},${endPoint.y}`)
      .attr('stroke', getRandomColor())
      .attr('stroke-width', strokeWidth)
      .attr('fill', 'none');
  };
  


// =========================
// =======  SQUARES  =======
// =========================

// Function to draw squares
export const drawSquares = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  width: number,
  height: number,
  size: number,
  getRandomColor: () => string,
  strokeWidth: number
) => {
  svg.selectAll('*').remove(); // Clear existing content

  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', size)
        .attr('height', size)
        .attr('fill', getRandomColor())
        .attr('stroke', 'black')
        .attr('stroke-width', strokeWidth);
    }
  }
};



// ===========================
// =======  TRIANGLES  =======
// ===========================

// Function to calculate control distance
const calculateControlDistance = (controlPointDistancePercent: number, size: number): number => {
  return (controlPointDistancePercent / 100) * size;
};

// Function to draw cubic Bézier triangles symmetrically
export const drawCubicBezierTrianglesSymmetric = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  width: number,
  height: number,
  size: number,
  bezierDegree: number,
  controlPointDistancePercent: number,
  getRandomColor: () => string,
  strokeWidth: number
) => {
  svg.selectAll('*').remove(); // Clear existing content

  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#2C3E50'); // Dark blue background

  const halfSize = size / 2;
  const controlDistance = calculateControlDistance(controlPointDistancePercent, size);
  const controlDegreeAdjustment = (bezierDegree * Math.PI) / 180;

  for (let y = 0; y < height; y += size) {
    const shiftX = (Math.floor(y / size) % 2 !== 0) ? halfSize : 0;

    for (let x = 0; x < width; x += size) {
      const p1 = { x: x + shiftX, y: y };
      const p2 = { x: x + size + shiftX, y: y };
      const p3 = { x: x + halfSize + shiftX, y: y + size };

      const calculateControlPoints = (
        start: { x: number; y: number },
        end: { x: number; y: number }
      ) => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const defaultDegree = Math.atan2(dy, dx);
        const finalDegree1 = defaultDegree + controlDegreeAdjustment;
        const finalDegree2 = defaultDegree - controlDegreeAdjustment;

        return {
          control1: {
            x: start.x + controlDistance * Math.cos(finalDegree1),
            y: start.y + controlDistance * Math.sin(finalDegree1),
          },
          control2: {
            x: end.x - controlDistance * Math.cos(finalDegree1),
            y: end.y - controlDistance * Math.sin(finalDegree1),
          },
        };
      };

      const controlsP1toP2 = calculateControlPoints(p1, p2);
      const controlsP2toP3 = calculateControlPoints(p2, p3);
      const controlsP3toP1 = calculateControlPoints(p3, p1);

      svg.append('path')
        .attr('d', `M${p1.x},${p1.y} C${controlsP1toP2.control1.x},${controlsP1toP2.control1.y} ${controlsP1toP2.control2.x},${controlsP1toP2.control2.y} ${p2.x},${p2.y}`)
        .attr('stroke', getRandomColor())
        .attr('stroke-width', strokeWidth)
        .attr('fill', 'none');
      svg.append('path')
        .attr('d', `M${p2.x},${p2.y} C${controlsP2toP3.control1.x},${controlsP2toP3.control1.y} ${controlsP2toP3.control2.x},${controlsP2toP3.control2.y} ${p3.x},${p3.y}`)
        .attr('stroke', getRandomColor())
        .attr('stroke-width', strokeWidth)
        .attr('fill', 'none');
      svg.append('path')
        .attr('d', `M${p3.x},${p3.y} C${controlsP3toP1.control1.x},${controlsP3toP1.control1.y} ${controlsP3toP1.control2.x},${controlsP3toP1.control2.y} ${p1.x},${p1.y}`)
        .attr('stroke', getRandomColor())
        .attr('stroke-width', strokeWidth)
        .attr('fill', 'none');
    }
  }
};
