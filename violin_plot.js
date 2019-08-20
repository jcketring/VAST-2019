function violin_plot(plot_name, color, damage_type) {
    var source_file = "mc1-reports-data.csv";
    
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 30, bottom: 50, left: 30},
        width = 800 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(plot_name)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Labels of row and columns
    var locations = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"]

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(locations)
        .padding(0.01);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    // Build Y scales and axis:
    var y = d3.scaleLinear()
        .range([ height, 0 ])
        .domain([ 0, 10 ])
    svg.append("g")
        .call(d3.axisLeft(y));

    //Add Labels
    svg.append("text")
        .attr("x", (width/2) - 25)
        .attr("y", height + margin.bottom*3/4)
        .style("font-size", "16px")
        .text("Location");

    // Features of the histogram
    var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))
        .value(d => d)



    //Read the data
    d3.csv(source_file, function(data) {
        //convert data to numbers
        data.forEach(function(d) {
            d.sewer_and_water = +d.sewer_and_water;
            d.power = +d.power;
            d.roads_and_bridges = +d.roads_and_bridges;
            d.medical = +d.medical;
            d.buildings = +d.buildings;
            d.shake_intensity = +d.shake_intensity;
            d.location = +d.location;
        });

        //Find the data corresponding to the appropriate damage type
        if (damage_type == "sewer") {
            var sumstat = d3.nest()
                .key(function(d) { return d.location;})
                .rollup(function(d) {
                input = d.map(function(g) { return g.sewer_and_water;})
                bins = histogram(input)
                return(bins)
            })
            .entries(data)
            svg.append("text")
                    .attr("x", 100)
                    .attr("y", 0 - (margin.top / 2))
                    .style("font-size", "20px")
                    .text("Damage Report Distribution for Water and Sewer Damage");

        } else if (damage_type == "power") {
            var sumstat = d3.nest()
                .key(function(d) { return d.location;})
                .rollup(function(d) {
                input = d.map(function(g) { return g.power;})
                bins = histogram(input)
                return(bins)
            })
        .entries(data)
            svg.append("text")
                    .attr("x", 100)
                    .attr("y", 0 - (margin.top / 2))
                    .style("font-size", "20px")
                    .text("Damage Report Distribution for Power Damage");

        } else if (damage_type == "roads") {
            var sumstat = d3.nest()
                .key(function(d) { return d.location;})
                .rollup(function(d) {
                input = d.map(function(g) { return g.roads_and_bridges;})
                bins = histogram(input)
                return(bins)
            })
        .entries(data)
            svg.append("text")
                    .attr("x", 100)
                    .attr("y", 0 - (margin.top / 2))
                    .style("font-size", "20px")
                    .text("Damage Report Distribution for Damage to Roads and Bridges");

        } else if (damage_type == "medical") {
            var sumstat = d3.nest()
                .key(function(d) { return d.location;})
                .rollup(function(d) {
                input = d.map(function(g) { return g.medical;})
                bins = histogram(input)
                return(bins)
            })
        .entries(data)
            svg.append("text")
                    .attr("x", 100)
                    .attr("y", 0 - (margin.top / 2))
                    .style("font-size", "20px")
                    .text("Damage Report Distribution for Damage to Medical Facilities");

        } else if (damage_type == "buildings") {
            var sumstat = d3.nest()
                .key(function(d) { return d.location;})
                .rollup(function(d) {
                input = d.map(function(g) { return g.buildings;})
                bins = histogram(input)
                return(bins)
            })
        .entries(data)
            svg.append("text")
                    .attr("x", 100)
                    .attr("y", 0 - (margin.top / 2))
                    .style("font-size", "20px")
                    .text("Damage Report Distribution for Building Damage");
        } else {
            console.log("Error: damage_type entered doesn't exist.")
        }

        // Find largest value in bin
        var maxNum = 4000

        // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
        var xNum = d3.scaleLinear()
            .range([0, x.bandwidth()])
            .domain([-maxNum,maxNum])

        // Add the shape to this svg!
        svg
            .selectAll("myViolin")
            .data(sumstat)
            .enter()
            .append("g")
            .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } )
            .append("path")
                .datum(function(d){ return(d.value)})
                .style("stroke", "none")
                .style("fill",color)
                .attr("d", d3.area()
                    .x0(function(d){ return(xNum(-d.length)) } )
                    .x1(function(d){ return(xNum(d.length)) } )
                    .y(function(d){ return(y(d.x0)) } )
                    .curve(d3.curveStep)
                )
    })
}

function violin_plot_input(plot_name, color, damage_type, nHours_input) {
    var source_file = "mc1-reports-data.csv";
    
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 30, bottom: 50, left: 30},
        width = 800 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(plot_name)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Labels of row and columns
    var locations = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"]



    // when the input range changes update the chart 
    d3.select(nHours_input).on("input", function() {
        update(+this.value);
    });

    // Initialize starting time of data 
    update(120);

    // update the elements
    function update(nHours) {
        //Clear previous selection
        svg.selectAll("*").remove();

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(locations)
            .padding(0.01);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        // Build Y scales and axis:
        var y = d3.scaleLinear()
            .range([ height, 0 ])
            .domain([ 0, 10 ])
        svg.append("g")
            .call(d3.axisLeft(y));

        //Add Labels
        svg.append("text")
            .attr("x", (width/2) - 25)
            .attr("y", height + margin.bottom*3/4)
            .style("font-size", "16px")
            .text("Location");

        // Features of the histogram
        var histogram = d3.histogram()
            .domain(y.domain())
            .thresholds(y.ticks(20))
            .value(d => d)

        // adjust the text on the range slider
        d3.select(nHours_input + "-value").text(nHours);
        d3.select(nHours_input).property("value", nHours);

        //Read the data
        d3.csv(source_file, function(data) {
            //convert data to numbers
            data.forEach(function(d) {
                d.time = new Date(d.time);
                d.sewer_and_water = +d.sewer_and_water;
                d.power = +d.power;
                d.roads_and_bridges = +d.roads_and_bridges;
                d.medical = +d.medical;
                d.buildings = +d.buildings;
                d.shake_intensity = +d.shake_intensity;
                d.location = +d.location;
            });

            //Find the maximum and minimum date
            var maxTime = data[0].time, minTime = data[0].time;
            for(i = 1; i < data.length; i++) {
                if (data[i].time > maxTime) {
                    maxTime = data[i].time;
                }
                if (data[i].time < minTime) {
                    minTime = data[i].time;
                }
            }
            maxTime = maxTime.getTime();
            minTime = minTime.getTime();
            
            var filtered_data = [];
            check_time = minTime + (nHours*3600000);
            for(i = 0; i < data.length; i++) {
                if (data[i].time.getTime() < check_time) {
                    filtered_data.push(data[i]);
                }
            }
            data = filtered_data;

            //Find the data corresponding to the appropriate damage type
            if (damage_type == "sewer") {
                var sumstat = d3.nest()
                    .key(function(d) { return d.location;})
                    .rollup(function(d) {
                        input = d.map(function(g) { return g.sewer_and_water;})
                        bins = histogram(input)
                        return(bins)
                    })
                    .entries(data)

                svg.append("text")
                        .attr("x", 100)
                        .attr("y", 0 - (margin.top / 2))
                        .style("font-size", "20px")
                        .text("Damage Report Distribution for Water and Sewer Damage");

            } else if (damage_type == "power") {
                var sumstat = d3.nest()
                    .key(function(d) { return d.location;})
                    .rollup(function(d) {
                        input = d.map(function(g) { return g.power;})
                        bins = histogram(input)
                        return(bins)
                    })
                    .entries(data)

                svg.append("text")
                        .attr("x", 100)
                        .attr("y", 0 - (margin.top / 2))
                        .style("font-size", "20px")
                        .text("Damage Report Distribution for Power Damage");

            } else if (damage_type == "roads") {
                var sumstat = d3.nest()
                    .key(function(d) { return d.location;})
                    .rollup(function(d) {
                        input = d.map(function(g) { return g.roads_and_bridges;})
                        bins = histogram(input)
                        return(bins)
                    })
                    .entries(data)

                svg.append("text")
                        .attr("x", 100)
                        .attr("y", 0 - (margin.top / 2))
                        .style("font-size", "20px")
                        .text("Damage Report Distribution for Damage to Roads and Bridges");

            } else if (damage_type == "medical") {
                var sumstat = d3.nest()
                    .key(function(d) { return d.location;})
                    .rollup(function(d) {
                        input = d.map(function(g) { return g.medical;})
                        bins = histogram(input)
                        return(bins)
                    })
                    .entries(data)

                svg.append("text")
                        .attr("x", 100)
                        .attr("y", 0 - (margin.top / 2))
                        .style("font-size", "20px")
                        .text("Damage Report Distribution for Damage to Medical Facilities");

            } else if (damage_type == "buildings") {
                var sumstat = d3.nest()
                    .key(function(d) { return d.location;})
                    .rollup(function(d) {
                        input = d.map(function(g) { return g.buildings;})
                        bins = histogram(input)
                        return(bins)
                    })
                    .entries(data)

                svg.append("text")
                        .attr("x", 100)
                        .attr("y", 0 - (margin.top / 2))
                        .style("font-size", "20px")
                        .text("Damage Report Distribution for Building Damage");
            } else {
                console.log("Error: damage_type entered doesn't exist.")
            }

            // Set cap for largest bin number
            var maxNum = 3000

            // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
            var xNum = d3.scaleLinear()
                .range([0, x.bandwidth()])
                .domain([-maxNum,maxNum])
    
            // Add the shape to this svg
            svg
                .selectAll("violin_graph")
                .data(sumstat)
                .enter()
                .append("g")
                    .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } )
                .append("path")
                    .datum(function(d){ return(d.value)})
                    .style("stroke", "none")
                    .style("fill",color)
                    .attr("d", d3.area()
                        .x0(function(d){ return(xNum(-d.length)) } )
                        .x1(function(d){ return(xNum(d.length)) } )
                        .y(function(d){ return(y(d.x0)) } )
                        .curve(d3.curveStep)
                    )
        })
    }
}

violin_plot("#chart1", "blue", "sewer");
violin_plot("#chart2", "yellow", "power");
violin_plot("#chart3", "green", "roads");
violin_plot("#chart4", "red", "medical");
violin_plot("#chart5", "violet", "buildings");

violin_plot_input("#chart6", "blue", "sewer", "#nHours6");
violin_plot_input("#chart7", "yellow", "power", "#nHours7");
violin_plot_input("#chart8", "green", "roads", "#nHours8");
violin_plot_input("#chart9", "red", "medical", "#nHours9");
violin_plot_input("#chart10", "violet", "buildings", "#nHours10");