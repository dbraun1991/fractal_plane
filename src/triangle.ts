import * as d3 from 'd3';

// ===========================
// =======  TRIANGLES  =======
// ===========================

// Function to calculate control distance
const calculateControlDistance = (controlPointDistancePercent: number, size: number): number => {
  return (controlPointDistancePercent / 100) * size;
};

// Function to draw cubic Bézier triangles symmetrically with an edge registry
export const drawCubicBezierTrianglesSymmetric = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  width: number,
  height: number,
  size: number,
  bezierDegree: number,
  controlPointDistancePercent: number,
  baseStrokeColor: string,
  strokeWidth: number,
  isSymmetric: boolean,
  bezierDegreeReduction: number,
  controlPointDistanceReduction: number
) => {

  // Registry to track edges
  const edgeRegistry = new Set<string>();

  const halfSize = size / 2;
  const controlDistance = calculateControlDistance(controlPointDistancePercent, size);
  const controlDegreeAdjustment = (bezierDegree * Math.PI) / 180;

  // Helper function to add an edge
  const addEdge = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    controls: { control1: { x: number; y: number }; control2: { x: number; y: number } }
  ) => {
    // Create a canonical representation for the edge
    const key = `${Math.min(p1.x, p2.x)},${Math.min(p1.y, p2.y)}-${Math.max(p1.x, p2.x)},${Math.max(p1.y, p2.y)}`;
    if (edgeRegistry.has(key)) return; // Edge already drawn, skip
    edgeRegistry.add(key);

    // Draw the Bézier curve for the edge
    svg.append('path')
      .attr(
        'd',
        `M${p1.x},${p1.y} C${controls.control1.x},${controls.control1.y} ${controls.control2.x},${controls.control2.y} ${p2.x},${p2.y}`
      )
      .attr('stroke', baseStrokeColor)
      .attr('stroke-width', strokeWidth)
      .attr('fill', 'none');
  };

  // Function to calculate altered control points based on position
  const calculateAlteredControlPoints = (
    start: { x: number; y: number },
    end: { x: number; y: number },
    maxDegreeReduction: number,
    maxDistanceReduction: number,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    // Calculate the factors for degree and distance alterations based on position
    const degreeFactor = (start.x + start.y) / (canvasWidth + canvasHeight);
    const distanceFactor = (start.x + start.y) / (canvasWidth + canvasHeight);

    const adjustedDegree = controlDegreeAdjustment * (1 - degreeFactor * (maxDegreeReduction / 100));
    const adjustedDistance = controlDistance * (1 - distanceFactor * (maxDistanceReduction / 100));

    // Calculate control points with the adjusted degree and distance
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const defaultDegree = Math.atan2(dy, dx);
    const controlDegree = defaultDegree + adjustedDegree;

    return {
      control1: {
        x: start.x + adjustedDistance * Math.cos(controlDegree),
        y: start.y + adjustedDistance * Math.sin(controlDegree),
      },
      control2: {
        x: end.x - adjustedDistance * Math.cos(controlDegree),
        y: end.y - adjustedDistance * Math.sin(controlDegree),
      },
    };
  };

  // Loop through the grid and draw triangles
  for (let y = size * 0.5; y < height - (size * 1.5); y += size) {
    const shiftX = (Math.floor(y / size) % 2 !== 0) ? halfSize : 0;

    for (let x = size * 0.5; x < width - (size * 1.8); x += size) {
      const p1 = { x: x + shiftX, y: y };
      const p2 = { x: x + size + shiftX, y: y };
      const p3 = { x: x + halfSize + shiftX, y: y + size };

      // Altered control points for each edge
      const controlsP1toP2 = calculateAlteredControlPoints(p1, p2, bezierDegreeReduction, controlPointDistanceReduction, width, height);
      const controlsP2toP3 = calculateAlteredControlPoints(p2, p3, bezierDegreeReduction, controlPointDistanceReduction, width, height);
      const controlsP3toP1 = calculateAlteredControlPoints(p3, p1, bezierDegreeReduction, controlPointDistanceReduction, width, height);

      // Add edges using the registry
      addEdge(p1, p2, controlsP1toP2);
      addEdge(p2, p3, controlsP2toP3);
      addEdge(p3, p1, controlsP3toP1);

      // Draw the filled triangle using a closed path
      svg.append('path')
        .attr(
          'd',
          `M${p1.x},${p1.y} C${controlsP1toP2.control1.x},${controlsP1toP2.control1.y} ${controlsP1toP2.control2.x},${controlsP1toP2.control2.y} ${p2.x},${p2.y} C${controlsP2toP3.control1.x},${controlsP2toP3.control1.y} ${controlsP2toP3.control2.x},${controlsP2toP3.control2.y} ${p3.x},${p3.y} C${controlsP3toP1.control1.x},${controlsP3toP1.control1.y} ${controlsP3toP1.control2.x},${controlsP3toP1.control2.y} ${p1.x},${p1.y}`
        )
        .attr('fill', 'none')
        .attr('stroke', 'none');
    }
  }
};
