let width= 800;
let height = 800;
let svgDx = 100;
let svgDy = 100;

let svg = d3.select("#container")
.append('svg')
.attr("width", width)
.attr("height", height)
.call(d3.zoom().on("zoom", function(){
  svg.attr("transform", d3.event.transform)
})
.scaleExtent([1, 6])
.translateExtent([[svgDx, svgDy], [width -(svgDx * 2) ,height-svgDy]]))
.append('g')


function showData(datasources, value) {
  let data = datasources[0];
  let mapInfo = datasources[1];
  let bodyHeight = 800;
  let bodyWidth = 800;


  let dataIndex = {};
  for (let i = 0; i < data.length; i++) {
    let c = data[i];
    let country = c.country;
    dataIndex[country] = c[value]
  }

  mapInfo.features = mapInfo.features.map(function (d) {
    let country = d.properties.name
    let valueX = dataIndex[country]
    d.properties[value] = valueX;
    return d;
  })

  let maxTotal = d3.max(mapInfo.features, function (d) { return d.properties[value] });
  let median = d3.median(mapInfo.features, function (d) { return d.properties[value]});
  let min = d3.min(mapInfo.features, function (d) { return d.properties[value]});
  
  let colorScale; 
  if(value === 'total'){
    colorScale = d3.scaleLinear()
      .domain([min, median, maxTotal])
      .range(["yellow", "orange", "red"]);
    appendLegend(min, median, maxTotal, "yellow", "orange", "red" )
  } else if (value === 'female' || value === 'male' ){
    colorScale = d3.scaleLinear()
    .domain([0, median, maxTotal])
    .range(["rgb(233, 242, 205)", 'rgb(212, 230, 160)', "rgb(108, 122, 67)"]);
    appendLegend(min, median, maxTotal, "rgb(233, 242, 205)", 'rgb(212, 230, 160)', "rgb(108, 122, 67)" )
  } else if (value === "rural" || value === 'urban'){
    colorScale = d3.scaleLinear()
    .domain([0, median, maxTotal])
    .range(["rgb(229, 219, 255)", "rgb(159, 131, 242)", "rgb(77, 42, 217)"]);
    appendLegend(min, median, maxTotal, "rgb(229, 219, 255)", "rgb(159, 131, 242)", "rgb(77, 42, 217)" )
  } else {
    colorScale = d3.scaleLinear()
    .domain([0, median, maxTotal])
    .range(["rgb(250, 208, 223)", "rgb(242, 62, 134)", "rgb(176, 96, 125)"]);
    appendLegend(min, median, maxTotal, "rgb(250, 208, 223)", "rgb(242, 62, 134)", "rgb(176, 96, 125)" )
  }




  let projection = d3.geoNaturalEarth1()
    .scale(100)
    .translate([bodyWidth / 2, bodyHeight / 2])

  

  let path = d3.geoPath()
    .projection(projection)

  let mouseLeave = function (d) {
    d3.selectAll("path")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "gray")
  }


  let mouseOver = function (d) {
    d3.selectAll("path")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "dark-gray")
  }

  svg.selectAll("path").data(mapInfo.features)
    .enter().append("path")
    .attr("d", function (d) { return path(d) })
    .attr("stroke", "gray")
    .attr("id", "country")
    .attr("fill",
      function (d) {
        if (d.properties[value]) {
          return colorScale(d.properties[value])
        }
        else {
          return "rgb(230, 230, 230)"
        }
      })
    .on("mouseleave", mouseLeave)
    .on("mouseover", mouseOver)
    .append('title')
    .text(function (d) {
        if (d.properties[value]) { return d.properties.name + ' ' + d.properties[value]}
      })
      .attr("id", "title")
  }


  function appendLegend(min, median, max, color1, color2, color3){
    svg.append("circle").attr("cx", 10).attr("cy", 130).attr("r", 6).style("fill", `${color3}`).attr('class', "legend").attr("position", "absolute")
    svg.append("circle").attr("cx", 10).attr("cy", 160).attr("r", 6).style("fill", `${color2}`).attr('class', "legend")
    svg.append("circle").attr("cx", 10).attr("cy", 190).attr("r", 6).style("fill", `${color1}`).attr('class', "legend")
    svg.append("text").attr("x", 20).attr("y", 130).text(`Maximum ${max}`).style("font-size", "15px").attr("alignment-baseline", "middle").attr('class', "legend")
    svg.append("text").attr("x", 20).attr("y", 160).text(`Median ${median}`).style("font-size", "15px").attr("alignment-baseline", "middle").attr('class', "legend")
    svg.append("text").attr("x", 20).attr("y", 190).text(`Minimum ${min}`).style("font-size", "15px").attr("alignment-baseline", "middle").attr('class', "legend")
  }



  function displayMap(filter) {
    d3.selectAll("path").remove()
    d3.selectAll("circle").remove()
    d3.selectAll("text").remove()
    switch(filter){
      case 'total':
        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data, "total"));
      break;
      case "female":
        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data, "female"));
      break;
      case "male":
        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data, "male"));
        break;
      case "rural":
        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data, "rural"));
        break;
      case "urban":
        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data, "urban"));
        break;
      case "poorest":
        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data, "poorest"));
        break;
      case "second":
        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data, "second"));
        break;
      case "middle":
        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data, "middle"));
        break;
      case "fourth":
        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data, "fourth"));
        break;
      case "richest":
        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data, "richest"));
    }
  }