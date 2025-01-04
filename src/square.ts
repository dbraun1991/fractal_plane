export const drawSquares = (
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    width: number,
    height: number,
    size: number,
    bezierDegree: number,
    controlPointDistancePercent: number,
    baseStrokeColor: string,
    strokeWidth: number,
    isSymmetric: boolean
  ) => {
    // A registry to avoid drawing the same edge twice (if shared)
    const edgeRegistry = new Set<string>();
  
    // Function to generate a unique key for an edge
    const getEdgeKey = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      // Create a canonical representation of the edge to ensure uniqueness
      return `${Math.min(p1.x, p2.x)},${Math.min(p1.y, p2.y)}-${Math.max(p1.x, p2.x)},${Math.max(p1.y, p2.y)}`;
    };
  
    // Function to calculate control distance for Bézier curves
    const calculateControlDistance = (controlPointDistancePercent: number, size: number): number => {
      return (controlPointDistancePercent / 100) * size;
    };
  
    // Function to draw Bézier curve for an edge
    const drawBezierEdge = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      symmetric: boolean
    ) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);
  
      // Ensure no bending when bezierDegree is 0
      if (bezierDegree === 0) {
        svg.append('path')
          .attr('d', `M${x1},${y1} L${x2},${y2}`)
          .attr('stroke', baseStrokeColor)
          .attr('stroke-width', strokeWidth)
          .attr('fill', 'none');
        return;
      }
  
      const controlDistance = calculateControlDistance(controlPointDistancePercent, size);
  
      let control1, control2;
      if (symmetric) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
  
        const controlAngle1 = angle + Math.PI / 2 + (bezierDegree * Math.PI) / 180;
        const controlAngle2 = angle - Math.PI / 2 - (bezierDegree * Math.PI) / 180;
  
        control1 = {
          x: midX + controlDistance * Math.cos(controlAngle1),
          y: midY + controlDistance * Math.sin(controlAngle1),
        };
  
        control2 = {
          x: midX + controlDistance * Math.cos(controlAngle2),
          y: midY + controlDistance * Math.sin(controlAngle2),
        };
      } else {
        const controlAngle1 = angle + (bezierDegree * Math.PI) / 180;
        const controlAngle2 = angle - (bezierDegree * Math.PI) / 180;
  
        control1 = {
          x: x1 + controlDistance * Math.cos(controlAngle1),
          y: y1 + controlDistance * Math.sin(controlAngle1),
        };
  
        control2 = {
          x: x2 - controlDistance * Math.cos(controlAngle2),
          y: y2 - controlDistance * Math.sin(controlAngle2),
        };
      }
  
      // Generate the key for this edge to avoid drawing it twice
      const edgeKey = getEdgeKey({ x: x1, y: y1 }, { x: x2, y: y2 });
  
      // Check if the edge has already been drawn
      if (!edgeRegistry.has(edgeKey)) {
        edgeRegistry.add(edgeKey);
  
        svg.append('path')
          .attr('d', `M${x1},${y1} C${control1.x},${control1.y} ${control2.x},${control2.y} ${x2},${y2}`)
          .attr('stroke', baseStrokeColor)
          .attr('stroke-width', strokeWidth)
          .attr('fill', 'none');
      }
    };
  
    // Loop through the grid and draw squares
    for (let x = size*0.5; x < width-(size*1.5); x += size) {
      for (let y = size*0.5; y < height-(size*1.5); y += size) {
        // Draw the four edges of the square, avoiding duplicates
        drawBezierEdge(x, y, x + size, y, isSymmetric); // Top edge
        drawBezierEdge(x + size, y, x + size, y + size, isSymmetric); // Right edge
        drawBezierEdge(x + size, y + size, x, y + size, isSymmetric); // Bottom edge
        drawBezierEdge(x, y + size, x, y, isSymmetric); // Left edge
      }
    }
  };
  