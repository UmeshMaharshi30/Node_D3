
const fs = require('fs');
const d3 = require('d3');
const o = require("./lib/outreach.js");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
var svgtopdf = require('svg-to-pdfkit');

var csv = require('csv-parser');
var kit = require('pdfkit');

/* for using d3.csv
if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch-polyfill');
}
const csv = require('d3-fetch').csv;
*/
const fakeDom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

const outputLocation = './output.svg';
const graphBackGround = "#F0F0F0";
var apples = o.generateObject();
    apples.title = "Apple Market Details";  // graph title
    apples.xLabel = "year"; // x axis label
    apples.xKey = "Year"; 
    apples.yLabel = "Production lbs"; // y axis label
    apples.yKey = "Value";
    apples.dataUrl = "data/apples.csv"; // path of the data file relative to the file in which it is being called 
    apples.dataType = "csv";
    apples.data = null; 
    apples.containerId = "apples";
    apples.graphDimentions = [700, 600]; // dimensions of the graph  
    //o.multilineChart(apples);

// creates an empty html document    
let body = d3.select(fakeDom.window.document).select('body');

// Make an SVG Container
let svgContainer = body.append("svg").attr("id", apples.containerId).style("width", apples.graphDimentions[0] + "px").style("height", apples.graphDimentions[1] + "px").style("background-color", graphBackGround);

// reads the data file, has to be a csv  
var contents = fs.readFileSync("./" + apples.dataUrl, 'utf8');

// parsing the csv
apples.rawData = d3.csvParse(contents);

// select the type of graph you want to display
/** multilineChart - Multi line chart graph
 *  groupedSTackBar - Grouped bar graph
 */

//o.multilineChart(apples, svgContainer);
o.groupedSTackBar(apples, svgContainer);

// creating an empty pdf file
var doc = new kit();
doc.pipe(fs.createWriteStream('output.pdf'));
let svgContent = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + body.select('svg').html() + '</svg>';
svgContent = svgContent.replace(/currentColor/g, 'black');
//console.log(svgContent);
//console.log('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + body.html() + '</svg');
// use body.html() for getting the svg of the data viz
svgtopdf(doc,  svgContent, 20, 20, {useCSS:true});

doc.end();

//fs.writeFileSync(outputLocation, body.html());                