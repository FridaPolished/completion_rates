let width= 1000;
let height = 600;
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
.translateExtent([[svgDx, svgDy], [width -svgDx,height-svgDy]]))
.append('g') 


function showData(datasources) {
  let data = datasources[0];
  let mapInfo = datasources[1];


  let dataIndex = {};
  for (let i = 0; i < data.length; i++) {
    let c = data[i];
    let country = c.country;
    if(c.total){
      dataIndex[country] = data[i]
    }
  }

  //set default value
  
  mapInfo.features = mapInfo.features.map(function (d) {
    let country = d.properties.name
    if(dataIndex[country]){
      // console.log(dataIndex[country].total)
      console.log(d)
      d.properties[total] = dataIndex[country].total;
      d.properties['other'] = dataIndex[country];
    }
    return d;
  })

  let maxTotal = d3.max(mapInfo.features, function (d) { 
    if (d){
      return d.properties.total
  } 
});
  let median = d3.median(mapInfo.features, function (d) { return d.properties[total]});
  let min = d3.min(mapInfo.features, function (d) { return d.properties[total]});
  
  let colorScale; 
  
    colorScale = d3.scaleLinear()
      .domain([min, median, maxTotal])
      .range(["yellow", "orange", "red"]);
    appendLegend(min, median, maxTotal, "yellow", "orange", "red" )
  

  //setting scale and position for map display
  let projection = d3.geoNaturalEarth1()
    .scale(170)
    .translate([width / 2, height / 2])

  let path = d3.geoPath()
    .projection(projection)

  //event listeners for effects on paths
  let mouseLeave = function (d) {
    d3.selectAll("path")
      .transition()
      .duration(200)
      .style("opacity", .8)
  }

  let mouseOver = function (d) {
    d3.selectAll("path")
      .transition()
      .duration(200)
      .style("opacity", 0.2)
    d3.select(this)
      .transition()
      .duration(100)
      .style("opacity", 5)
  }

  //formatting tooltip info
  let otherValues = function (target, value) {
    let k = value;
    let capitalizedValue = k[0].toUpperCase() + k.slice(1);
    if(target[k]){
      return ` <div class="">${capitalizedValue}: ${target[k]}</div>`
    } else {
      return ""
    }
  }

  //tooltip
  const tip = d3.tip()
    .attr('class', 'tip card')
    .style('color', 'black')
    .style('padding', '10px')
    .style('background-color', 'white')
    .style('border', 'solid gray')
    .html(d => {
      if(d.properties.other){
        let target = d.properties.other;
        let content = `<div class="options-title" >${target.country}</div>`
        content += otherValues(target, 'total')
        content += `<div class="options-title">Gender</div>`
        content += otherValues(target, 'female')
        content += otherValues(target, 'male')
        if(target.rural){
          content += `<div class="options-title">Residence</div >`
        }
        content += otherValues(target, 'rural')
        content += otherValues(target, 'urban')
        if(target.poorest){
          content += `<div class="options-title">Wealth Quintile</div>`
        }
        content += otherValues(target, 'poorest')
        content += otherValues(target, 'second')
        content += otherValues(target, 'middle')
        content += otherValues(target, 'fourth')
        content += otherValues(target, 'richest')
        return content;
      } 
    });

    
    
    svg.selectAll("path").data(mapInfo.features)
    .enter().append("path")
    .attr("d", function (d) { return path(d) })
    .attr("stroke", "gray")
    .attr("id", "country")
    .attr("fill",
    function (d) {
      if (d.properties[total] && !(d.properties[total] === '-')) {
        return colorScale(d.properties[total])
      }
      else {
        return "rgb(230, 230, 230)"
      }
    })
    .attr("position", "relative")
    .on("mouseleave", mouseLeave)
    .on("mouseover", mouseOver)
    
    svg.call(tip);
    
    svg.selectAll('path')
    .on('mouseover', (d, i, n) =>  tip.show(d, n[i]))
    .on('mouseout', (d, i, n) =>  tip.hide())
  }

 

  function appendLegend(min, median, max, color1, color2, color3){
    svg.append("circle").attr("cx", 10).attr("cy", 50).attr("r", 6).style("fill", `${color3}`).attr('class', "legend").attr("position", "absolute")
    svg.append("circle").attr("cx", 10).attr("cy", 80).attr("r", 6).style("fill", `${color2}`).attr('class', "legend").attr("position", "absolute")
    svg.append("circle").attr("cx", 10).attr("cy", 111).attr("r", 6).style("fill", `${color1}`).attr('class', "legend").attr("position", "absolute")
    svg.append("text").attr("x", 20).attr("y", 50).text(`Maximum ${max}`).style("font-size", "15px").attr("alignment-baseline", "middle").attr('class', "legend")
    svg.append("text").attr("x", 20).attr("y", 80).text(`Median ${median}`).style("font-size", "15px").attr("alignment-baseline", "middle").attr('class', "legend")
    svg.append("text").attr("x", 20).attr("y", 111).text(`Minimum ${min}`).style("font-size", "15px").attr("alignment-baseline", "middle").attr('class', "legend")
  }


  //gather data into main object datasource;
  function displayMap() {
    // d3.selectAll("path").remove()
    // d3.selectAll("circle").remove()
    // d3.selectAll("text").remove()

        Promise.all([
          d3.json('data.json'),
          d3.json('countries.geo.json')
        ]).then((data) => showData(data));   
  }


  //modal functionality
var modal = document.getElementById("modal");
var btn = document.getElementById("comp-button");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// displayMap()
