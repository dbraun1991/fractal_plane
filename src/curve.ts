import * as d3 from 'd3';

// ==============================
// =======  SINGLE CURVE  =======
// ==============================

export const drawSingleBezierCurve = (
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    width: number,
    height: number,
    bezierDegree: number,
    controlPointOffsetPercent: number,
    getRandomColor: () => string,
    strokeWidth: number,
    prepareBackground: () => void,
    isSymmetric:boolean
  ) => {
    svg.selectAll('*').remove(); // Clear existing content

    // Use the centralized background preparation logic
    prepareBackground();

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
