// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 750;

// Define chart margin / padding
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 50
};

// Define dimensions of chart area

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import data

d3.csv("assets/data/data.csv").then(function(censusData) {

    // Parse Data/Cast as numbers

    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });
    
    // Create scale functions

    var xLinearScale = d3.scaleLinear()
    .domain([6, d3.max(censusData, c => c.poverty)])
    .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, c => c.healthcare)])
    .range([chartHeight, 0]);

    // Create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart

    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);
    
    // Create Circles

    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", c => xLinearScale(c.poverty))
    .attr("cy", c => yLinearScale(c.healthcare))
    .attr("r", "20")
    .attr("fill", "red")
    .attr("opacity", ".8");
    
    // Add SVG text element and text attributes
    // text to circle from stack overflow https://stackoverflow.com/questions/13615381/d3-add-text-to-circle

    var textLables = chartGroup.selectAll(null)
    .data(censusData)
    .enter()
    .append("text")
    .text(c => c.abbr)
    .attr("dx", c => xLinearScale(c.poverty) - 8)
    .attr("dy", c => yLinearScale(c.healthcare) + 3)
    .attr("font-size", "11px")
    .style("fill","White")
    .attr("font-weight", "bold");

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
});

