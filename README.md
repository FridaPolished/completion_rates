# UNICEF School Completion Rates 2019
## Upper-secondary Education

#### Overview

  Completion rates provides a data visualization for the completion rates from upper secondary education around the world.

All data from "Completion rates"(November 2019) by [Unicef](https://data.unicef.org/resources/dataset/education-data/)


Visit the live site [here](https://fridapolished.github.io/)

#### Instructions
  * Select a filter to display results.
  * Check the results by hovering over the coutry you are interested.

 ### Exploring the map:
  * Pan and zoom with your mouse scroll.
  * You can zoom in automatically with double click. 

#### MVP
  * Format the data.
  * Render data on map.
  * Add controls to filter the data.

#### Technologies, Libraries and APIs

* JavaScript
* CSS
* HTML
* D3
* GEOJSON

  
  #### Features

  Displays information using color coding to represent values:
  ![colored world map representing total completion rates](https://i.imgur.com/6OR9LDH.png)

  Displays countries specific results on hover:
  ![tooltip showing specific results for a country](https://i.imgur.com/erDRK1v.png)

  ### Code snippets

  Example of switch case to filter results by removing any previous elements and sending the new selection to render the map:

  ```javascript
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
      ...
     }
    }
  ```

#### Implementation timeline
  * Day 1
    * Define data and aproach to visualization
    * Build data file in JSON format.
  * Day 2
    * Build on geoJSON file.
    * Build elements in DOM to render map.
    * Add tooltips to display general information.
  * Day 3 
    * Continue building elements in DOM to render map.
    * Add new versions of the map to filter results by specific data.
    * Add color legend to explain color range.
  * Day 4
    * Add styling and introduction description paragraph on completion rates concept.
  * Day 5 
    * Finishing touches and presentation