var d3 = require('d3');


//var fetch = require('d3-fetch');
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.o = global.o || {})));
    }(this, (function (exports) { 'use strict'; 
    var version = "1.0"; 
    const dimensions = [800, 600];
    const containerId = "containerId";
    const graphBackGround = "#F0F0F0";

    const margin = {top: 40, right: 80, bottom: 30, left: 50}

    function generateGraphObject() {
        var go = {};
                go.title = "";  
                go.xLabel = "";
                go.xKey = "";
                go.yKey = "";
                go.yLabel = "";
                go.dataUrl = "";
                go.dataType = "";
                go.data = null;
                go.rawData = null;
                go.containerId = "";
                go.graphDimentions = dimensions;  
        return go;
    }

    function multilineChart(go, svg) {
        //var svg = d3.select("#" + go.containerId).append("svg").style("width", go.graphDimentions[0] + "px").style("height", go.graphDimentions[1] + "px").style("background-color", graphBackGround);
        if(go.title) {
            svg.append("text").text(go.title).attr("x", go.graphDimentions[0]/2).attr("y", 20).style("text-anchor", "middle");
        }
        drawMultiLine(go, svg);
        /*
        d3.csv("http://localhost:8080/" + go.dataUrl, function(d, _, columns) {
            return d;
          }).then(function(data) {
            console.log(data);  
            go.rawData = data;
            drawMultiLine(go, svg);
          });
          */
    }

    
    function drawMultiLine(go, svg) {

    var width = go.graphDimentions[0] - margin.left - margin.right,
    height = go.graphDimentions[1] - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.Production); });

        var data = go.rawData;
        var entity = data.columns.slice(1).map(function(id) {
            return {
              id: id,
              values: data.map(function(d) {
                if(d[id] != "" ) {
                return {date: +d.Year, Production: parseFloat(d[id].replace(/,/g, ""))};
              }
              })
            };
          });
         go.data = entity;
         entity.forEach((element, index) => {
            var sanitizedData = [];
            element.values.forEach(elem => {
              if(elem != undefined) sanitizedData.push(elem);
            });
            entity[index].values = sanitizedData;
        });
      
      
        x.domain(d3.extent(go.rawData, function(d) { return +d.Year; }));
      
        y.domain([
          d3.min(entity, function(c) {  return d3.min(c.values, function(d) { return d.Production; }); }),
          d3.max(entity, function(c) { return d3.max(c.values, function(d) { return d.Production; }); })
        ]);
      
      
        z.domain(entity.map(function(c) { return c.id; }));

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format("")));
      
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).tickFormat(d3.format(".2s")))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text(go.yLabel);
      
      
        var city = g.selectAll(".city")
          .data(entity)
          .enter().append("g")
            .attr("class", "city");
      
      
        city.append("path")
            .attr("class", "line").style("fill", "none")
            .attr("d", function(d) {return line(d.values); })
            .style("stroke", function(d) { return z(d.id); })
            .style("width", "1.5px");
        
        var points = [];
      
        entity.forEach(element => {
            var cirArr = [];
            element.values.forEach(elem => {
              var cir = elem;
              cir.id = element.id;
              cirArr.push(cir);
            });
            points.push(cirArr);
        });
        //console.log(points.length);
        /*
        city.append("g").attr("class", "cirlces").selectAll(".city")
          .data(function(d,i) { console.log(i); return points[i]})
          .enter().append("circle")
          .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.date); })
            .style("cy", function(d) { return y(d.Production); })
            .style("fill", function(d) { return z(d.id); }); 
        */
            /*
        city.append("text")
            .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.Production) + ")"; })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(function(d) { return d.id; });
        */
      //append the legend
      var legend = svg.selectAll('.legend')
              .data(entity);
          
      var legendEnter=legend
              .enter()
              .append('g')
              .attr('class', 'legend')
              .attr('id',function(d){ return d.id; });
      
        //actually add the circles to the created legend container
        legendEnter.append('circle')
              .attr('cx', width - 50)
              .attr('cy', function(d,i){return y.range()[1] + 25 + (i * 20);})
              .attr('r', 7)
              .style('fill', function(d) { 
                    return z(d.id);
              });
                              
          //add the legend text
          legendEnter.append('text')
              .attr('x', width - 40)
              .attr('y', function(d,i){return y.range()[1] + 30 + (i * 20);})
              .text(function(d){ return d.id; });     
    }

    function groupedSTackBar(go, svg) {
        //var svg = d3.select("#" + go.containerId).append("svg").style("width", go.graphDimentions[0] + "px").style("height", go.graphDimentions[1] + "px").style("background-color", graphBackGround);
        if(go.title) {
            svg.append("text").text(go.title).attr("x", go.graphDimentions[0]/2).attr("y", 20).style("text-anchor", "middle");
        }
        drawgroupedSTackBar(go, svg);
        /*
        d3.csv(go.dataUrl, function(d, _, columns) {
            return d;
          }).then(function(data) {
            go.rawData = data;
            drawgroupedSTackBar(go, svg);
          });
          */
    }

    
    function drawgroupedSTackBar(go, svg) {

        var width = go.graphDimentions[0] - margin.left - margin.right,
        height = go.graphDimentions[1] - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var keys = go.rawData.columns.slice(1);
        var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1),
            x1 = d3.scaleBand().range([height, 0]).padding(0.05),
            y = d3.scaleLinear().range([height, 0]),
            z = d3.scaleOrdinal(d3.schemeCategory10);
        
        x0.domain(go.rawData.map(function(d) { return +d.Year; }));
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(go.rawData, function(d) { return d3.max(keys, function(key) { return +d[key].replace(/,/g, "") }); })]).nice();

        var entity = go.rawData.forEach(function(d) {
            d.Year = +d.Year;
            keys.forEach(function(keyData) {
                d[keyData] = +d[keyData].replace(/,/g, "");
                if(d[keyData] == undefined) d[keyData] = 0;
            });
          });
         go.data = go.rawData;


        g.append("g")
         .selectAll("g")
        .data(go.data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.Year) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return keys.map(function(key) { return {key: key, Value: d[key]}; }); })
        .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.Value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.Value); })
        .attr("fill", function(d) { return z(d.key); });

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 20)
            .attr("y", y(y.ticks().pop()) - 10.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("text-anchor", "end")
            .text(go.yLabel);

            var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
          .selectAll("g")
          .data(keys.slice().reverse())
          .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      
        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);
      
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });   

    }

    /*
    module.exports = {
        version: version,
        multilineChart : multilineChart,
        generateObject : generateGraphObject,
        groupedSTackBar : groupedSTackBar
    }
    */
    
    exports.version = version;
    exports.multilineChart = multilineChart;
    exports.generateObject = generateGraphObject;
    exports.groupedSTackBar = groupedSTackBar;
    
})));   