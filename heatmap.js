function heatmap(heatmap_name, color, damage_type) {
    var source_file = "mc1-reports-data.csv";
    
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 30, bottom: 50, left: 30},
        width = 800 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(heatmap_name)
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

    // Build Y scales and axis:
    var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(scores)
        .padding(0);
    svg.append("g")
        .call(d3.axisLeft(y));

    //Add Labels
    svg.append("text")
        .attr("x", (width/2) - 50)
        .attr("y", height + margin.bottom*3/4)
        .style("font-size", "16px")
        .text("Location");

    // Build color scale
    var type_color = d3.scaleLinear()
        .range(["white", color])
        .domain([1,3000])

    //Read the data
    d3.csv(source_file, function(data) {
        //convert data to numbers
        data.forEach(function(d) {
            d.time = new Date(d.population);
            d.sewer_and_water = +d.sewer_and_water;
            d.power = +d.power;
            d.roads_and_bridges = +d.roads_and_bridges;
            d.medical = +d.medical;
            d.buildings = +d.buildings;
            d.shake_intensity = +d.shake_intensity;
            d.location = +d.location;
        });

        //sort the data into an array of the sum of each response
        n_locations = 19;
        var sorted_data = new Array(n_locations*11);
        k = 0;
        for(i = 0; i < n_locations; i++) {
            for(j = 0; j < 11; j++) {
                sorted_data[k] = {
                    location: i + 1,
                    score: j,
                    total: 0
                };
                k++;
            }
        }
        //Count the data corresponding to the appropriate damage type
        if (damage_type == "sewer") {
            for(i = 0; i < data.length; i++) {
                index = (data[i].location - 1)*11 + data[i].sewer_and_water;
                sorted_data[index].total = sorted_data[index].total + 1;
            }
            svg.append("text")
                    .attr("x", 100)
                    .attr("y", 0 - (margin.top / 2))
                    .style("font-size", "20px")
                    .text("Damage Report Distribution for Water and Sewer Damage");

        } else if (damage_type == "power") {
            for(i = 0; i < data.length; i++) {
                index = (data[i].location - 1)*11 + data[i].power;
                sorted_data[index].total = sorted_data[index].total + 1;
            }
            svg.append("text")
                    .attr("x", 100)
                    .attr("y", 0 - (margin.top / 2))
                    .style("font-size", "20px")
                    .text("Damage Report Distribution for Power Damage");

        } else if (damage_type == "roads") {
            for(i = 0; i < data.length; i++) {
                index = (data[i].location - 1)*11 + data[i].roads_and_bridges;
                sorted_data[index].total = sorted_data[index].total + 1;
            }
            svg.append("text")
                    .attr("x", 100)
                    .attr("y", 0 - (margin.top / 2))
                    .style("font-size", "20px")
                    .text("Damage Report Distribution for Damage to Roads and Bridges");

        } else if (damage_type == "medical") {
            for(i = 0; i < data.length; i++) {
                index = (data[i].location - 1)*11 + data[i].medical;
                sorted_data[index].total = sorted_data[index].total + 1;
            }
            svg.append("text")
                    .attr("x", 100)
                    .attr("y", 0 - (margin.top / 2))
                    .style("font-size", "20px")
                    .text("Damage Report Distribution for Damage to Medical Facilities");

        } else if (damage_type == "buildings") {
            for(i = 0; i < data.length; i++) {
                index = (data[i].location - 1)*11 + data[i].buildings;
                sorted_data[index].total = sorted_data[index].total + 1;
            }
            svg.append("text")
                    .attr("x", 100)
                    .attr("y", 0 - (margin.top / 2))
                    .style("font-size", "20px")
                    .text("Damage Report Distribution for Building Damage");
        } else {
            console.log("Error: damage_type entered doesn't exist.")
        }
        

        svg.selectAll()
            .data(sorted_data, function(d) {return d.location+':'+d.score;})
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.location) })
            .attr("y", function(d) { return y(d.score) })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return type_color(d.total)} )
    })
}

heatmap("#heatmap1", "blue", "sewer");
heatmap("#heatmap2", "yellow", "power");
heatmap("#heatmap3", "green", "roads");
heatmap("#heatmap4", "red", "medical");
heatmap("#heatmap5", "violet", "buildings");