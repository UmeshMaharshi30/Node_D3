// Instructions:
//  npm install --save d3 jsdom


const fs = require('fs');
const d3 = require('d3');
const o = require("./lib/outreach.js");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
var svgtopdf = require('svg-to-pdfkit');
var http = require('http');
var url = require('url') ;

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
                apples.title = "Apple Market Details";  
                apples.xLabel = "year";
                apples.xKey = "Year";
                apples.yLabel = "Production lbs";
                apples.yKey = "Value";
                apples.dataUrl = "data/apples.csv";
                apples.dataType = "csv";
                apples.data = null;
                apples.containerId = "apples";
                apples.graphDimentions = [700, 600];  
                //o.multilineChart(apples);

let body = d3.select(fakeDom.window.document).select('body');

// Make an SVG Container
let svgContainer = body.append("svg").attr("id", apples.containerId).style("width", apples.graphDimentions[0] + "px").style("height", apples.graphDimentions[1] + "px").style("background-color", graphBackGround);
                /*
                fs.createReadStream("./" + apples.dataUrl)
                .pipe(csv())
                .on('data', function (data) {
                    
                });
                */
                var contents = fs.readFileSync("./" + apples.dataUrl, 'utf8');
                apples.rawData = d3.csvParse(contents);
                o.multilineChart(apples, svgContainer);
                //o.groupedSTackBar(apples, svgContainer);
                var doc = new kit();
                doc.pipe(fs.createWriteStream('output.pdf'));
                svgtopdf(doc, body.html(), 20, 20);
                doc.end();
                fs.writeFileSync(outputLocation, body.html());                


// Draw a line
/*
let circle = svgContainer.append("line")
  .attr("x1", 5)
  .attr("y1", 5)
  .attr("x2", 500)
  .attr("y2", 500)
  .attr("stroke-width", 2)
  .attr("stroke", "black");
*/
// Output the result to console
//console.log(body.select('.container').html());

// Output the result to file
