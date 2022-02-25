// @TODO: YOUR CODE HERE!

// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the donuts.csv file
// =================================
d3.json("/api/pals").then(function(bballData) {
  console.log(bballData);

  bballData.forEach(function(data) {
    // data.date = parseTime(data.date);
    data.HOME_ABBR = data.HOME_ABBR
    data.normMargin = +data.normMargin;
    data.FG_PCT_home = +data.FG_PCT_home;
  });

  console.log(bballData)  

  // Step 5: Create Scales
  //= ============================================
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(bballData, d => d.FG_PCT_home))
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(bballData, d => d.normMargin)])
    .range([height, 0]);

  // var yLinearScale2 = d3.scaleLinear()
  //   .domain([0, d3.max(donutData, d => d.evening)])
  //   .range([height, 0]);

  // Step 6: Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xLinearScale);
    // .tickFormat(d3.timeFormat("%d-%b"));
  var leftAxis = d3.axisLeft(yLinearScale);
  // var rightAxis = d3.axisRight(yLinearScale2);

 


  // Step 7: Append the axes to the chartGroup - ADD STYLING
  // ==============================================
  // Add bottomAxis
  var xAxisG = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
  

    chartGroup.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + 20 + 20) + ")")
      //.attr('class', 'axis-label')
      //can add fill, font-size
      .style("text-anchor", "middle")
      .text("FG_PCT");

        // text label for the y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Margin of Victory (scaled 0-3)");      

    // adding axes, search on Google:
    // should be TutorialsPoint 


  xAxisG.call(bottomAxis);

  // the Title
  chartGroup.append("text")
        .attr("x", (width / 2))             
        .attr("y", - 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("text-decoration", "underline")  
        .text("Margin of Victory vs. FG Percentage");


 

  // CHANGE THE TEXT TO THE CORRECT COLOR
  chartGroup.append("g")
    .attr("stroke", "green") // NEW!
    .call(leftAxis);

  // CHANGE THE TEXT TO THE CORRECT COLOR
  // chartGroup.append("g")
  //   .attr("transform", `translate(${width}, 0)`)
  //   .attr("stroke", "orange") // NEW!
  //   .call(rightAxis);

  // Want to add some circles for each thing

  chartGroup.append("g")
    .selectAll('dot')
    .data(bballData)
    .enter()
    .append('circle')
      .attr('cx', function(d) { return xLinearScale(d.FG_PCT_home);})
      .attr('cy', function(d) { return yLinearScale(d.normMargin);})
      .attr('r', 10)
      .style('fill', '#69b3a2')

  // I want to add a Title and X and Y Names
      
  var circleLabels = chartGroup.selectAll(null).data(bballData).enter().append("text");

  circleLabels
    .attr("x", function(d) {
      return xLinearScale(d.FG_PCT_home);
    })
    .attr("y", function(d) {
      return yLinearScale(d.normMargin);
    })
    .text(function(d) {
      return d.HOME_ABBR;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

}).catch(function(error) {
  console.log(error);
});
