// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60, 
    left: 50
};

var width = svgWidth - margin.left -margin.right;
var height = svgHeight - margin.top-margin.bottom; 

var svg = d3
.select(".scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", 'translate(${margin.left}, ${margin.top})');

d3.csv("data.csv")
.then(function(healthData){

    healthData.forEach(function(data){
        data.income = +data.income;
        data.obesity = +data.obesity;

    });

    var xLinearScale = d3.scaleLinear()
    .domain ([ d3.max(healthData, d => d.income)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.obesity)])
    .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
    .attr("transform", 'translate(0, ${height})')
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale (d.income))
    .attr("cy", d => yLinearScale (d.obesity))
    .attr("r", "15")
    .attr("fill","blue")
    .attr("opacity",".5");

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d){
        return ('${d.abbr}<br>Income: ${d.income}<br>Obestiy Rate:${d.obesity}');
    });

    chartGroup.call(toolTip);

    circlesGroup.on("click",function(data){
        toolTip.show(data, this);
    })
    .on("mouseout", function(data,index){
        toolTip.hide(data);
    });

    chartGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("y",0 -margin.left +40)
    .attr("x",0-(height/2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Income");

    chartGroup.append("text")
    .attr("transform", 'translate(${width/2},${height + margin.top +30})')
    .attr("class","axisText")
    .text("Obesity Rate");
}); 

