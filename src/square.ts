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
