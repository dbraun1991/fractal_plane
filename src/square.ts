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
    // A registry to avoid drawing the same edge twice (if shared)
    const edgeRegistry = new Set<string>();
  
    // Function to generate a unique key for an edge
    const getEdgeKey = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
      // Create a canonical representation of the edge to ensure uniqueness
      return `${Math.min(p1.x, p2.x)},${Math.min(p1.y, p2.y)}-${Math.max(p1.x, p2.x)},${Math.max(p1.y, p2.y)}`;
    };
  
    // Function to calculate control distance for Bézier curves
    const calculateControlDistance = (controlPointDistancePercent: number, size: number): number => {
      return (controlPointDistancePercent / 100) * size;
    };
  
    // Function to draw Bézier curve for an edge
    const drawBezierEdge = (x1: number, y1: number, x2: number, y2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);
      const controlAngle1 = angle + (bezierDegree * Math.PI) / 180;
      const controlAngle2 = angle - (bezierDegree * Math.PI) / 180;
  
      const control1 = {
        x: x1 + controlDistance * Math.cos(controlAngle1),
        y: y1 + controlDistance * Math.sin(controlAngle1),
      };
  
      const control2 = {
        x: x2 - controlDistance * Math.cos(controlAngle2),
        y: y2 - controlDistance * Math.sin(controlAngle2),
      };
  
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
  
    // Calculate control distance for Bézier curves
    const controlDistance = calculateControlDistance(controlPointDistancePercent, size);
  
    // Loop through the grid and draw squares
    for (let x = 0; x < width; x += size) {
      for (let y = 0; y < height; y += size) {
        // Draw the four edges of the square, avoiding duplicates
        // Top edge
        drawBezierEdge(x, y, x + size, y); // Top edge
        // Right edge
        drawBezierEdge(x + size, y, x + size, y + size); // Right edge
        // Bottom edge
        drawBezierEdge(x + size, y + size, x, y + size); // Bottom edge
        // Left edge
        drawBezierEdge(x, y + size, x, y); // Left edge
      }
    }
  };
  