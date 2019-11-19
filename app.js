// import * as d3 from "d3";
import {select} from 'd3';

const svg = select('svg');
const width = +svg.attr('width');
const heigth = +svg.attr('height');

const render = data => {
  svg.selectAll('rect').data(data)
  .enter().append('rect')
  .attr('width', 300)
  .attr('height', 300)
}

csv('data.csv').then(data => {
  data.forEach( d => {
    d.country
  })
})