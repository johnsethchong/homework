// @TODO: YOUR CODE HERE!
// Set up chart parameters (height, width, margins)
var svgHeight = 660;
var svgWidth = 960;
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right

//Create SVG container
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read in CSV/json
d3.csv("../data/data.csv").then(function(healthData){
    console.log(healthData);
    //Parse data (poverty and healthcare)
    healthData.forEach(function(data){ 
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    //Create scales
    var xLinearScale = d3.scaleLinear().range([0, width]);
    var yLinearScale = d3.scaleLinear().range([height, 0]);

    //Create Axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(healthData, function(data) {
        return data.healthcare;
    });

    xMax = d3.max(healhData, function(data) {
        return data.healthcare;
    });

    yMin = d3.min(healthData, function(data) {
        return data.poverty;
    });

    yMax=d3.max(healthData, function(data) {
        return data.poverty;
    });


    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

    //Append axes to SVG group (chartGroup)
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);


    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", .75)
    .on("mouseout", function(data, index) {
        toolTip.hide(data);

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
        return (abbr + '%');
        });        


    chartGroup.call(toolTip);

    //Make event listeners to display and hide the tooltip
    abbrGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty");
});