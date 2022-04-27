function d3TimeLine(data){
    metadata = Object.entries(data).slice(0,1).map(entry => entry[1])[0];
    data = Object.entries(data).slice(1,).map(entry => entry[1]);
    const panelId = metadata['panelId'];
    var displayHeight = document.getElementById(panelId.substring(1)).clientHeight;
    var displayWidth = document.getElementById(panelId.substring(1)).clientWidth;
    var width = displayWidth*0.6;
    var height = displayHeight*0.6;
    var margin = {top: (displayHeight-height)/2, left: (displayWidth-width)/2};
    for(var ind of Object.keys(data)) {
        data[ind].ActivityDate = d3.timeParse("%d/%m/%Y")(data[ind].ActivityDate);
    }
    var displayHeight = document.getElementById(panelId.substring(1)).clientHeight;
    var displayWidth = document.getElementById(panelId.substring(1)).clientWidth;
    var svg = d3.select(panelId)
            .append("svg")
            .attr("width", displayWidth)
            .attr("height", displayHeight)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.ActivityDate; }))
        .range([ 0, width ]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

//https://code.tutsplus.com/tutorials/building-a-multi-line-chart-using-d3js-part-2--cms-22973

    var columns = Object.values(
                    Object.keys(metadata)
                        .filter(key => key[0]=='c')
                        .reduce((obj, key) => {
                            obj[key] = metadata[key];
                            return obj
                        }, {})
                    );
    
    var res = d3.min(data, function(d) {
        var minVal = Number.MAX_SAFE_INTEGER;
        var maxVal = Number.MIN_SAFE_INTEGER;
        for(var col of columns) {
            minVal = Math.min(minVal, d[col]);
            maxVal = Math.max(maxVal, d[col]);
        }
        return minVal;
    });
    allVal = [];
    for(var col of columns) {
        allVal = allVal.concat(data.map(function (d){return d[col]}));
    }

    // Add Y axis
    var y = d3.scaleLinear()
        .domain(d3.extent(allVal))
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    //d3 category10 scheme used to color categories
    var catCol = d3.scaleOrdinal().domain(columns).range(d3.schemeCategory10);
    // // Add the line

    var ind = 1;
    for(var col of columns) {
        //The code from below till has been put in loop to draw multiple linegraphs
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", catCol(col))
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d) { return x(d.ActivityDate) })
            .y(function(d) { return y(d[col])}));
        svg.append("circle")
            .attr("cx",width-50)
            .attr("cy",20*ind)
            .attr("r",4)
            .style("fill", catCol(col));
        svg.append("text")
            .attr("x",width-40)
            .attr("y",20*ind+4) //+radius
            .text(col)
            .style("font-size","15px")
            .attr("alignment-baseline","middle");
        ind += 1;
    }
}

function d3heatMap(data) {
    const metaData = data[0];
    const panelId = metaData['panelId']
    const displayHeight = document.getElementById(panelId.substring(1)).clientHeight;
    const displayWidth = document.getElementById(panelId.substring(1)).clientWidth;
    const width = Math.min(displayWidth,displayHeight)*0.7;
    const height = width;
    const margin = {top: (displayHeight-height)/2, left: (displayWidth-width)/2};
    var dates = data[1]['dates'];
    dates = dates.map(d => d.slice(0,-5));
    const interval = dates.length;
    var dispData = data[2]['data'];
    // for(var [ind, val] of dates.entries()) {
    //     dates[ind] = d3.timeParse("%d/%m/%Y")(val);
    // }
    // console.log(data[2]['data']);
    // // append the svg object to the body of the page
    var svg = d3.select(panelId)
    .append("svg")
    .attr("width", displayWidth)
    .attr("height", displayHeight)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // // Labels of row and columns
    var myGroups = dates;
    var myVars = dates;

    // // Build X scales and axis:
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.01);
    svg.append("g")
    .style("font","7px times")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor","end")
    .attr("transform", "rotate(-60)")


    // // Build X scales and axis:
    var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.01);
    svg.append("g")
    .style("font","7px times")
    .call(d3.axisLeft(y));

    // Build color scale
    var myColor = d3.scaleLinear()
    .range(["white", "#69b3a2"])
    .domain([0,1])

    // //Read the data
    // d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {

    // // create a tooltip
    // var tooltip = d3.select(panelId)
    // .append("div")
    // .style("opacity", 0)
    // .attr("class", "tooltip")
    // .style("background-color", "white")
    // .style("border", "solid")
    // .style("border-width", "2px")
    // .style("border-radius", "5px")
    // .style("padding", "5px")

    // // Three function that change the tooltip when user hover / move / leave a cell
    // var mouseover = function(d) {
    // tooltip.style("opacity", 1)
    // }
    // var mousemove = function(d) {
    // tooltip
    //     .html("The exact value of<br>this cell is: " + d.value)
    //     .style("left", (d3.mouse(this)[0]+70) + "px")
    //     .style("top", (d3.mouse(this)[1]) + "px")
    // }
    // var mouseleave = function(d) {
    // tooltip.style("opacity", 0)
    // }

    // // add the squares
    // svg.selectAll()
    // .data(data, function(d) {return d.group+':'+d.variable;})
    // .enter()
    const cellsize = x.bandwidth();
    for([ind, val] of dispData.entries()) {
        svg.append("rect")
        .attr("x", function(d) { return cellsize*(Math.floor(ind%interval))})
        .attr("y", function(d) { return cellsize*(Math.floor(ind/interval))})
        .attr("width",  cellsize)
        .attr("height", cellsize)
        .style("fill", function(d) { return myColor(val)} );
    }
    
    const matrixHeight = cellsize*interval
    const colorbarHgt = matrixHeight*0.8;
    const gap = 2;
    const step = 0.001;
    for(var ind of d3.range(0,1,step)) {
        svg.append("rect")
            .datum(ind+1)
            .attr("x", width+cellsize*5)
            .attr("y", 0.9*matrixHeight-ind*(colorbarHgt))
            .attr("width", cellsize*2)
            .attr("height",colorbarHgt*step)
            .attr("fill",myColor(ind))
      }
      svg.append("text")
      .attr("x",width+cellsize*2)
      .attr("y",0.08*matrixHeight)
      .text("Co-relation matrix")
      .style("font-size",cellsize+"px");
      svg.append("text")
      .attr("x",width+cellsize*6+10)
      .attr("y",0.1*matrixHeight+3*cellsize)
      .text("1")
      .style("font-size",2*cellsize+"px");;
      svg.append("text")
      .attr("x",width+cellsize*6+10)
      .attr("y",0.9*matrixHeight)
      .text("0")
      .style("font-size",2*cellsize+"px");
    // .on("mouseover", mouseover)
    // .on("mousemove", mousemove)
    // .on("mouseleave", mouseleave)
    // })
}

function d3Scatter(data) {
    metadata = Object.entries(data).slice(0,2).map(entry => entry[1]);
    data = Object.entries(data).slice(2,).map(entry => entry[1])[0].data;
    
    for(let i=0; i< data.length; i++) {
        data[i]['ActivityDay'] = i+1
    }
    const panelId = metadata[0]['panelId'];
    const category = metadata[1]['category'];
    var displayHeight = document.getElementById(panelId.substring(1)).clientHeight;
    var displayWidth = document.getElementById(panelId.substring(1)).clientWidth;
    var width = displayWidth*0.6;
    var height = displayHeight*0.6;
    var margin = {top: (displayHeight-height)/2, left: (displayWidth-width)/2};
    for(var ind of Object.keys(data)) {
        data[ind].ActivityDate = d3.timeParse("%d/%m/%Y")(data[ind].ActivityDate);
    }
    var displayHeight = document.getElementById(panelId.substring(1)).clientHeight;
    var displayWidth = document.getElementById(panelId.substring(1)).clientWidth;
    var svg = d3.select(panelId)
            .append("svg")
            .attr("width", displayWidth)
            .attr("height", displayHeight)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d[category + '_pca_1']; }))
        .range([0, width ]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d[category + '_pca_2']; }))
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));


    var color = d3.scaleSequential(d3.interpolateHcl("#60c96e", "#4d4193")).domain([1, data.length+1])
    //d3 category10 scheme used to color categories
    // var catCol = d3.scaleOrdinal().domain(columns).range(d3.schemeCategory10);
    // // Add the line

    var ind = 1;
        //The code from below till has been put in loop to draw multiple linegraphs
    // svg.append("path")
    //     .datum(data)
    //     .attr("fill", "none")
    //     .attr("stroke", catCol(col))
    //     .attr("stroke-width", 1.5)
    //     .attr("d", d3.line()
    //     .x(function(d) { return x(d.ActivityDate) })
    //     .y(function(d) { return y(d[col])}));
    // svg.append("circle")
    //     .attr("cx",width-50)
    //     .attr("cy",20*ind)
    //     .attr("r",4)
    //     .style("fill", catCol(col));
    // svg.append("text")
    //     .attr("x",width-40)
    //     .attr("y",20*ind+4) //+radius
    //     .text(col)
    //     .style("font-size","15px")
    //     .attr("alignment-baseline","middle");

    // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", function (d) { return x(d[category + '_pca_1']); } )
        .attr("cy", function (d) { return y(d[category + '_pca_2']); } )
        .attr("r", 3.5)
        .style("fill", function (d) { return color(d.ActivityDay) } )
    // console.log(x, y)
    

    let activityDates = data.map(function(d) { return d.ActivityDate})
    n = 4

    let keys = []
    for (let i = 0; i<activityDates.length; i++){
        if (i % Math.floor(activityDates.length/n+1) == 0)
            keys.push(activityDates[i])
    }
    keys = keys.map(k => String(k).split(' ').slice(1, 4).join('-'))
    interpolate = d3.interpolateHcl("#60c96e", "#4d4193")
    colorScale = d3.scaleOrdinal((f = function(){
        let sampledColors = []
        for (let i=0; i<1.1; i += 1.1/n) {
            sampledColors.push(interpolate(i))
        }
        return sampledColors
    })(), keys)
    // .domain()
    // .range()
    

// Add one dot in the legend for each name.
    svg.selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
        .attr("cx", 100)
        .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 5)
        .style("fill", function(d){ return colorScale(d)})
        .attr("transform",
        "translate(" + 300 + "," + -100 + ")");


    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", 113)
        .attr("y", function(d,i){ return 105 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return colorScale(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .attr("transform",
        "translate(" + 300 + "," + -100 + ")");


}

function d3BarChart(data) {
    const metaData = data[0];
    data = data[1]['type'] == 'firstEigenGap' ? data[2].data[0] : data[2].data[1]
    const panelId = metaData['panelId']
    const displayHeight = document.getElementById(panelId.substring(1)).clientHeight;
    const displayWidth = document.getElementById(panelId.substring(1)).clientWidth;
    const width = Math.min(displayWidth,displayHeight)*0.7;
    const height = width;
    const margin = {top: (displayHeight-height)/2, left: (displayWidth-width)/2};
    // for(var [ind, val] of dates.entries()) {
    //     dates[ind] = d3.timeParse("%d/%m/%Y")(val);
    // }
    // console.log(data[2]['data']);
    // // append the svg object to the body of the page
    var svg = d3.select(panelId)
    .append("svg")
    .attr("width", displayWidth)
    .attr("height", displayHeight)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // // Labels of row and columns
    // // Build X scales and axis:
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.category; }))
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    maxEG = Math.max(...data.map(function(d) { return d.eigenGap; }))
    
        // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, maxEG])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
        .attr("x", function(d) { return x(d.category); })
        .attr("width", x.bandwidth())
        .attr("fill", "#69b3a2")
        // no bar at the beginning thus:
        .attr("height", function(d) { return height - y(0); }) // always equal to 0
        .attr("y", function(d) { return y(0); })
    
    // Animation
    svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return y(d.eigenGap); })
    .attr("height", function(d) { return height - y(d.eigenGap); })
    .delay(function(d,i){console.log(i) ; return(i*100)})
    
    
}