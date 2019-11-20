let svg = d3.select("#container")
.append('svg')
.attr("width", 800)
.attr("height", 800)
.call(d3.zoom().on("zoom", function(){
  svg.attr("transform", d3.event.transform)
})
  .scaleExtent([1, 8])
  )
.append('g')


// Promise.all([
//   d3.json('data.json'),
//   d3.json('countries.geo.json')
// ]).then(showData);



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

  let colorScale; 
  if(value === 'total'){
    colorScale = d3.scaleLinear()
      .domain([0, median, maxTotal])
      .range(["yellow", "orange", "red"]);
  } else if (value === 'female'){
    colorScale = d3.scaleLinear()
      .domain([0, median, maxTotal])
      .range(["yellow", 'rgb(200, 245, 66)', "green"]);
  } else if (value === 'male'){
    colorScale = d3.scaleLinear()
      .domain([0, median, maxTotal])
      .range(["rbg(84, 255, 212)", 'rgb(5, 171, 158)', "rbg(2, 102, 94)"]);
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
    .attr("fill",
      function (d) {
        if (d.properties[value]) {
          return colorScale(d.properties[value])
        }
        else {
          return "white"
        }
      })
    .on("mouseleave", mouseLeave)
    .on("mouseover", mouseOver)
    .append('title')
    .text(function (d) {
      if (d.properties[value]) { return d.properties.name + ' ' + d.properties[value]}
    })
    .attr("class", "title")
}


  function displayMap(filter) {
    
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