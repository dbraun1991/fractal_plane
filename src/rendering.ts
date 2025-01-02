// rendering.ts
import * as d3 from 'd3';



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
