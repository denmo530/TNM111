/**
 *
    Author: Kahin Akram
    Date: Jan 24, 2020
    TNM048 Lab 1 - Visual Information-Seeking Mantra
    Color information file
 *
*/

//We first have to create a dataset for the circules with some information
var circleData = [
    { "cx": 30, "cy": 30, "radius": 12, "color": "#4d4d4d", "text": "No Data available" },
    { "cx": 30, "cy": 60, "radius": 12, "color": "#fef0d9", "text": "1-2 Deaths" },
    { "cx": 30, "cy": 90, "radius": 12, "color": "#fdcc8a", "text": "3-11 Deaths" },
    { "cx": 30, "cy": 120, "radius": 12, "color": "#fc8d59", "text": "12-100 Deaths" },
    { "cx": 30, "cy": 150, "radius": 12, "color": "#d7301f", "text": ">100 Deaths" }
];

//Then get width and height of the parent
var width = $("#color-info").parent().width();
var height = $("#color-info").parent().height() - 30;

//Then we create the SVG Viewport
var svgContainer = d3.select("#color-info")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//After we add circles to the svgContainer
var circles = svgContainer.selectAll("circle")
    .data(circleData)
    .enter()
    .append("circle");

//And some circle attributes
var circleAttributes = circles
    .attr("cx", function (d) { return d.cx; })
    .attr("cy", function (d) { return d.cy; })
    .attr("r", function (d) { return d.radius; })
    .style("fill", function (d) { return d.color; });

//Also adding some text to the svgContainer
var text = svgContainer.selectAll("text")
    .data(circleData)
    .enter()
    .append("text");

//And lastly adding the SVG Text Element Attributes
var textLabels = text
    .attr("x", function (d) { return d.cx + 30; })
    .attr("y", function (d) { return d.cy + 3; })
    .text(function (d) { return d.text; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", "black");
