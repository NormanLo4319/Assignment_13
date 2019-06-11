// For scatter plot 1

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

var svg = d3.select("#scatter1")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
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
        .domain([8, d3.max(censusData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
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
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", ".5")


    var circlesGroup = chartGroup.selectAll()
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));

    
    var toolTip =d3.tip()
        .attr("class", "tooltip")
        .offset([80, -80])
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
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
        .text("Lack of Healthcare (%)")
    
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top +20})`)
        .attr("class", "axisText")
        .text("In Poverty (%)")
});



