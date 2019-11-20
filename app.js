let svg = d3.select("#container")
.append('svg')
.attr("width", 800)
.attr("height", 800)
.call(d3.zoom().on("zoom", function(){
  svg.attr("transform", d3.event.transform)
}))
.append('g')


Promise.all([
  d3.json('data.json'),
  d3.json('countries.geo.json')
]).then(showData);



function showData(datasources) {
  let data = datasources[0];
  let mapInfo = datasources[1];
  let bodyHeight = 800;
  let bodyWidth = 800;


  let dataIndex = {};
  for (let i = 0; i < data.length; i++) {
    let c = data[i];
    let country = c.country;
    dataIndex[country] = c.total
  }

  mapInfo.features = mapInfo.features.map(function (d) {
    let country = d.properties.name
    let total = dataIndex[country]
    d.properties.total = total;
    return d;
  })

  let maxTotal = d3.max(mapInfo.features, function (d) { return d.properties.total });
  let median = d3.median(mapInfo.features, function (d) { return d.properties.total });

  let colorScale = d3.scaleLinear()
    .domain([0, median, maxTotal])
    .range(["yellow", "orange", "red"]);


  let projection = d3.geoNaturalEarth1()
    .scale(120)
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
        if (d.properties.total) {
          return colorScale(d.properties.total)
        }
        else {
          return "white"
        }
      })
    .on("mouseleave", mouseLeave)
    .on("mouseover", mouseOver)
    .append('title')
    .text(function (d) {
      if (d.properties.total) { return d.properties.name + ' ' + d.properties.total }
    })
    .attr("class", "title")
}

// Promise.all([
//   d3.json('data.json'),
//   d3.json('countries.geo.json')
// ]).then(genderData)

function genderData(datasources){
    let data = datasources[0];
    let mapInfo = datasources[1];
    let bodyHeight = 800;
    let bodyWidth = 800;


    let dataIndex = {};
    for (let i = 0; i < data.length; i++) {
      let c = data[i];
      let country = c.country;
      dataIndex[country] = c.female
    }

    mapInfo.features = mapInfo.features.map(function (d) {
      let country = d.properties.name
      let female = dataIndex[country]
      d.properties.female = female;
      return d;
    })

    let maxTotal = d3.max(mapInfo.features, function (d) { return d.properties.female });
    let median = d3.median(mapInfo.features, function (d) { return d.properties.female });



    let colorScale = d3.scaleLinear()
      .domain([0, median, maxTotal])
      .range(["yellow", "green", "dark-green"]);



    let projection = d3.geoNaturalEarth1()
      .scale(120)
      .translate([bodyWidth / 2, bodyHeight / 2])

    let path = d3.geoPath()
      .projection(projection)

    svg.selectAll("path").data(mapInfo.features)
      .enter().append("path")
      .attr("d", function (d) { return path(d) })
      .attr("stroke", "gray")
      .attr("fill",
        function (d) {
          if (d.properties.female) {
            return colorScale(d.properties.female)
          }
          else {
            return "white"
          }
        })
      .append('title')
      .text(function (d) {
        if (d.properties.total) { return d.properties.name + ' ' + d.properties.female }
      })
      .attr("class", "title")
  }
