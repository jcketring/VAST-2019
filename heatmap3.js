// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#heatmap")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var locations = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"]
var scores = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

// Build X scales and axis:
var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(locations)
    .padding(0.15);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

// Build X scales and axis:
var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(scores)
    .padding(0);
svg.append("g")
    .call(d3.axisLeft(y));

// Build color scale
var myColor = d3.scaleLinear()
    .range(["white", "blue"])
    .domain([1,3000])

//Read the data
d3.csv("sewer.csv", function(data) {

    svg.selectAll()
        .data(data, function(d) {return d.location+':'+d.score;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.location) })
        .attr("y", function(d) { return y(d.score) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return myColor(d.total)} )

})
