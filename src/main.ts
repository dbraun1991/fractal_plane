import * as d3 from 'd3';

const width = 800;
const height = 600;

const svg = d3
  .select('#app')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('border', '1px solid black');

// Example: Generate a grid of squares
const size = 50;
for (let x = 0; x < width; x += size) {
  for (let y = 0; y < height; y += size) {
    svg.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', size)
      .attr('height', size)
      .attr('fill', 'none')
      .attr('stroke', 'black');
  }
}

