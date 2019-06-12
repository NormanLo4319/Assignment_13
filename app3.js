// For scatter plot 3
var svgWidth = 600;
var svgHeight = 360;

var margin = {
    top:20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg3 = d3.select("#scatter3")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg3.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Retrieve data from the CSV file and execute 
d3.csv("data.csv")
    .then(function(censusData) {

    // console.log(censusData)

    censusData.forEach(function(data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smoke = +data.smokes;
    });


    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(censusData, d => d.smoke)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([18, d3.max(censusData, d => d.obesity)])
        .range([height, 0]);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.smoke))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 15)
        .attr("fill", "red")
        .attr("opacity", ".5")


    var circlesGroup = chartGroup.selectAll()
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.smoke))
        .attr("y", d => yLinearScale(d.obesity))
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));

    
    var toolTip =d3.tip()
        .attr("class", "tooltip")
        .offset([80, -80])
        .html(function(d) {
            return (`${d.state}<br>Smoke: ${d.smoke}<br>Obesity: ${d.obesity}`);
        });
    
    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })

        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity Rate (%)")
    
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top +20})`)
        .attr("class", "axisText")
        .text("Smoke Ratio (%)")
});