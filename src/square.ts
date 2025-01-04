export const drawSquares = (
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    width: number,
    height: number,
    size: number,
    bezierDegree: number,
    controlPointDistancePercent: number,
    baseStrokeColor: string,
    strokeWidth: number
  ) => {

    // Registry to track edges
    const edgeRegistry = new Set<string>();
  
    const getEdgeKey = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      return `${Math.min(p1.x, p2.x)},${Math.min(p1.y, p2.y)}-${Math.max(p1.x, p2.x)},${Math.max(p1.y, p2.y)}`;
    };

    const controlDegreeAdjustment = (bezierDegree * Math.PI) / 180;
  
    // Calculate control points for Bézier curves
    const calculateControlPoints = (
      start: { x: number; y: number },
      end: { x: number; y: number }
    ) => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const defaultDegree = Math.atan2(dy, dx);
  
      const controlDistance = (controlPointDistancePercent / 100) * size;
  
      const finalDegree1 = defaultDegree + controlDegreeAdjustment;
      const finalDegree2 = defaultDegree - controlDegreeAdjustment;
  
      return {
        control1: {
          x: start.x + controlDistance * Math.cos(finalDegree1),
          y: start.y + controlDistance * Math.sin(finalDegree1),
        },
        control2: {
          x: end.x - controlDistance * Math.cos(finalDegree2),
          y: end.y - controlDistance * Math.sin(finalDegree2),
        },
      };
    };
  
    const drawBezierEdge = (
      p1: { x: number; y: number },
      p2: { x: number; y: number }
    ) => {
      const controls = calculateControlPoints(p1, p2);
  
      const edgeKey = getEdgeKey(p1, p2);
      if (!edgeRegistry.has(edgeKey)) {
        edgeRegistry.add(edgeKey);
  
        svg.append('path')
          .attr(
            'd',
            `M${p1.x},${p1.y} C${controls.control1.x},${controls.control1.y} ${controls.control2.x},${controls.control2.y} ${p2.x},${p2.y}`
          )
          .attr('stroke', baseStrokeColor)
          .attr('stroke-width', strokeWidth)
          .attr('fill', 'none');
      }
    };
  
    for (let x = 0; x < width; x += size) {
      for (let y = 0; y < height; y += size) {
        const p1 = { x, y };
        const p2 = { x: x + size, y };
        const p3 = { x: x + size, y: y + size };
        const p4 = { x, y: y + size };
  
        drawBezierEdge(p1, p2); // Top edge
        drawBezierEdge(p2, p3); // Right edge
        drawBezierEdge(p3, p4); // Bottom edge
        drawBezierEdge(p4, p1); // Left edge
      }
    }
  };
  


  
  

  import * as d3 from 'd3';

// ===========================
// =======  CUBIC BEZIER SQUARES =======
// ===========================

export const drawCubicBezierSquaresSymmetric = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  width: number,
  height: number,
  size: number,
  bezierDegree: number,
  controlPointDistancePercent: number,
  baseStrokeColor: string,
  strokeWidth: number,
  bezierDegreeReduction: number,
  controlPointDistanceReduction: number
) => {
  // Registry to track edges
  const edgeRegistry = new Set<string>();

  const getEdgeKey = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return `${Math.min(p1.x, p2.x)},${Math.min(p1.y, p2.y)}-${Math.max(p1.x, p2.x)},${Math.max(p1.y, p2.y)}`;
  };

  // Convert the degree into radians for rotation
  const controlDegreeAdjustment = (bezierDegree * Math.PI) / 180;

  // Function to calculate control points with gradient reduction
  const calculateControlPoints = (
    start: { x: number; y: number },
    end: { x: number; y: number },
    bezierDegreeReduction: number,
    controlPointDistanceReduction: number,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    // Midpoint calculation for each edge
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    // Default degree of the line (angle of the line segment)
    const defaultDegree = Math.atan2(dy, dx);

    // Control point distance is calculated as a percentage of size
    const controlDistance = (controlPointDistancePercent / 100) * size;

    // Apply gradient reduction logic for degree and control point distance
    const degreeFactor = (start.x + start.y) / (canvasWidth + canvasHeight);
    const distanceFactor = (start.x + start.y) / (canvasWidth + canvasHeight);

    // Adjust degree and distance based on reduction factors
    const adjustedDegree = controlDegreeAdjustment * (1 - degreeFactor * (bezierDegreeReduction / 100));
    const adjustedDistance = controlDistance * (1 - distanceFactor * (controlPointDistanceReduction / 100));

    // Calculate the direction of control points
    const controlDegree = defaultDegree + adjustedDegree;

    // Calculate the control points with the adjusted degree and distance
    const control1 = {
      x: start.x + adjustedDistance * Math.cos(controlDegree),
      y: start.y + adjustedDistance * Math.sin(controlDegree),
    };

    const control2 = {
      x: end.x - adjustedDistance * Math.cos(controlDegree),
      y: end.y - adjustedDistance * Math.sin(controlDegree),
    };

    return { control1, control2 };
  };

  const drawBezierEdge = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    bezierDegreeReduction: number,
    controlPointDistanceReduction: number,
    width: number,
    height: number
  ) => {
    const controls = calculateControlPoints(
      p1,
      p2,
      bezierDegreeReduction,
      controlPointDistanceReduction,
      width,
      height
    );

    const edgeKey = getEdgeKey(p1, p2);
    if (!edgeRegistry.has(edgeKey)) {
      edgeRegistry.add(edgeKey);

      // Return Bézier curve path data
      return `M${p1.x},${p1.y} C${controls.control1.x},${controls.control1.y} ${controls.control2.x},${controls.control2.y} ${p2.x},${p2.y}`;
    }
    return '';
  };

  // Loop to draw squares and their edges
  let pathData = '';
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      const p1 = { x, y };
      const p2 = { x: x + size, y };
      const p3 = { x: x + size, y: y + size };
      const p4 = { x, y: y + size };

      // Create Bézier curves for each edge of the square
      pathData += drawBezierEdge(p1, p2, bezierDegreeReduction, controlPointDistanceReduction, width, height); // Top edge
      pathData += drawBezierEdge(p2, p3, bezierDegreeReduction, controlPointDistanceReduction, width, height); // Right edge
      pathData += drawBezierEdge(p3, p4, bezierDegreeReduction, controlPointDistanceReduction, width, height); // Bottom edge
      pathData += drawBezierEdge(p4, p1, bezierDegreeReduction, controlPointDistanceReduction, width, height); // Left edge
    }
  }

  // Append the path to the SVG for the square
  svg.append('path')
    .attr('d', pathData + ' Z') // Z closes the path by connecting the last point to the first
    .attr('stroke', baseStrokeColor)
    .attr('stroke-width', strokeWidth)
    .attr('fill', 'none') // fill the square
    .attr('fill-opacity', 0.2); // Adjust opacity for visibility of the curve
};
