let width= 950;
let height = 700;
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

  //set values in properties
  mapInfo.features = mapInfo.features.map(function (d) {
    let country = d.properties.name
    if(dataIndex[country]){
      // console.log(dataIndex[country].total)
      d.properties['total'] = dataIndex[country].total;
      d.properties['other'] = dataIndex[country];
    }
    return d;
  })

  //set color scale values
  let maxTotal = d3.max(mapInfo.features, (d) => {  
    if (d) return d.properties['total'];
  });
  let median = d3.median(mapInfo.features, d => d.properties['total']);
  let min = d3.min(mapInfo.features, d =>  d.properties['total']);
  
  let colorScale = d3.scaleLinear()
      .domain([min, median, maxTotal])
    .range(['#fc8d59', '#ffffbf', '#91bfdb']);


  //legend setup
  const legendGroup = svg.append('g')
    .attr('transform', `translate(40, 200)`);

  const legend = d3.legendColor()
    .shape('circle')
    .shapePadding(10)
    .scale(colorScale)
    .title('Rates');
  

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
  
  let mouseOver = function (d, n, i) {
    d3.selectAll("path")
    .transition()
    .duration(200)
    .style("opacity", 0.2)
    d3.select(this)
    .transition()
    .duration(100)
    .style("opacity", 5)
  }
  

  legendGroup.call(legend)


  //formatting tooltip info
  let otherValues =  (target, value) => {
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

    //define tootip content
    if(d.properties.other){
      let target = d.properties.other;
      let residence;
      let wealth;
      if (target.rural || target.urban) {
        residence =
        `<div class="options">
            <div class="options options-title">Residence </div >
            ${otherValues(target, 'rural')}
           ${otherValues(target, 'urban')}
         </div >`} 
         else {
           residence = ""
         }

      if (target.poorest || target.richest || target.middle || target.second) {
        wealth =
          `<div class="options">
            <div class="options options-title">Wealth Quintile</div>
              ${otherValues(target, 'poorest')}
              ${otherValues(target, 'second')}
              ${otherValues(target, 'middle')}
              ${otherValues(target, 'fourth')}
              ${otherValues(target, 'richest')}     
        </div>`
      } else {
        wealth = ""
      }
      let content = 
      `
        <div class="title-country active" style="background-color:${colorScale(target.total)}" >
          ${target.country}
        </div>
        <div class="options">
            <div class=" options options-title">Total</div>
            ${target.total}
        </div>
        <div class="options">
          <div class=" options options-title">Gender</div>
          ${otherValues(target, 'female')}
          ${otherValues(target, 'male')}
        </div>
        ${residence}
        ${wealth}
        ` 
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
      if (d.properties['total'] && !(d.properties['total'] === '-')) {
        return colorScale(d.properties['total'])
      }
      else {
        return "rgb(230, 230, 230)"
      }
    })
    .attr("position", "relative")
    // .on("mouseleave", mouseLeave)
    .on("mouseover", (d, i, n) => {
      if(d.properties['total']) tip.show(d, n[i])
    })
    .on('mouseleave', (d, i, n) => tip.hide())
    svg.call(tip);
}

  //gather data into main object datasource
  Promise.all([
    d3.json('data.json'),
    d3.json('countries.geo.json')
  ]).then((data) => showData(data));   



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

