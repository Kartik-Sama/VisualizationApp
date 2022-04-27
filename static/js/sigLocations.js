//Month days map
monthDays = {1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31}

function calendarPie(data) {
    meta = Object.entries(data).slice(0,1)[0][1];
    panelId = meta['panelId']
    data = Object.entries(data).slice(1,).map(entry => entry[1]);        
    dates = Object.entries(data).map(entry => d3.timeParse("%Y-%m-%d")(entry[1]['ActivityDate']));
    console.log(data,"pie");
    values =  Object.entries(data).map(entry => (entry[1]['locations']));
    pieData = values[2];
    var margin = {top:40, left:20}

    var pie = d3.pie().value(function(d) {
                return d.proportion;});
    var catCol = d3.scaleOrdinal().domain(d3.range(5)).range(d3.schemeCategory10);    
    var displayHeight = document.getElementById(panelId.substring(1)).clientHeight;
    var displayWidth = document.getElementById(panelId.substring(1)).clientWidth;
    const X = dates;
    var curDay = ((X[0].getDay()-X[0].getDate())%7 + 7)%7;
    const availableDates = X.map(entry => entry.getDate());
    const totalDays = monthDays[X[0].getMonth()+1];
    const Y = Object.entries(data).map(entry => (entry[1]['locations'][0]['proportion']));
    const I = d3.range(totalDays);
    var xind = 0;
    const Month = 11;
    const Year = 2021;
    const yFormat = '';
    const cellSize = 55;
    var width = cellSize*7;
    var height = cellSize*8;
    var margin = {top: (displayHeight-height)/2,left: (displayWidth-width)/2};
    console.log(panelId, displayHeight, displayWidth);
    console.log(height, width, margin.top, margin.left);
    
    const radius = cellSize/2-2;
    const colors = d3.scaleLinear().domain([d3.min(Y),d3.max(Y)]).range(["paleturquoise", "dodgerblue"]);
    // // Compute a color scale. This assumes a diverging color scheme where the pivot
    // // is zero, and we want symmetric difference around zero.
    // const max = d3.quantile(Y, 0.9975, Math.abs);
    const formatDay = i => "MTWTFSS"[i];

    var svg = d3.select(panelId)
                .append("svg")
                .attr("width", displayWidth)
                .attr("height", displayHeight)
                .append("g")
                .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    for(var day of d3.range(7)) {
      svg.append("rect")
      .datum(ind+1)
      .attr("x", day*cellSize+1)
      .attr("y", 1)
      .attr("height", radius*2)
      .attr("width", radius*2)
      .attr("stroke","black")
      .attr("stroke-width","1px")
      .attr("rx",radius/2)
      .attr("ry",radius/2)
      .attr("fill","#FFD700")

      svg.append("text")
          .attr("x", day*cellSize+1+radius)
          .attr("y", 1+radius)
          .text(formatDay(day))
          .attr("alignment-baseline","middle")
          .attr("text-anchor","middle")
          .style("font-size",String(cellSize/3)+"px")
    }
    
    points = d3.range(d3.min(Y),d3.max(Y),0.001).reverse();
    sampleHeight = Math.ceil(X.length/7)*cellSize

    var valueInd = 0;
    console.log(I,"I")
    for(var ind of I) {
        pieData = values[valueInd];
        // console.log(values,ind,pieData,ind);
        if(availableDates.includes(ind+1)) {
                svg.selectAll('g')
                        .data(pie(pieData))
                        .enter()
                        .append("path")
                        .attr('d', d3.arc()
                                .innerRadius(0)
                                .outerRadius(radius))
                        .attr('fill', function(d){return(catCol(d.index))})
                        .attr("stroke", "black")
                        .attr('transform',"translate("+(curDay%7*cellSize+radius+1)+"+"+((Math.floor(curDay/7)+1)*cellSize+radius+1)+")")
                        .style("stroke-width", "1px")
                        .style("opacity", 0.7);
                valueInd += 1;
        }
        else {
                svg.append("circle")
                .attr("r",radius)
                .attr('fill', "#999997")
                .attr("cx",curDay%7*cellSize+radius+1)
                .attr("cy",(Math.floor(curDay/7)+1)*cellSize+radius+1)
                .style("stroke-width", "1px")
                .style("opacity", 1)
        }
        svg.append("text")
                .attr("x", curDay%7*cellSize+1)
                .attr("y", (Math.floor(curDay/7)+1)*cellSize+radius/3)
                .text(ind+1)
                .attr("alignment-baseline","mathematical")
                .attr("text-anchor","middle")
                .style("font-size",String(cellSize/5)+"px")
                .style("color","white");
        curDay += 1;
    }
  }

  function p1Calendar(data) {
        meta = Object.entries(data).slice(0,1)[0][1];
        console.log(meta);
        panelId = meta['panelId']
        data = Object.entries(data).slice(1,).map(entry => entry[1]);
        dates = Object.entries(data).map(entry => d3.timeParse("%Y-%m-%d")(entry[1]['ActivityDate']))
        values =  Object.entries(data).map(entry => (entry[1]['locations'][0]['proportion']))
        console.log(data,"sigloc");
        const X = dates;
        var curDay = ((X[0].getDay()-X[0].getDate())%7 + 7)%7;
        const availableDates = X.map(entry => entry.getDate());
        const totalDays = monthDays[X[0].getMonth()+1];
        const Y = values;
        const I = d3.range(totalDays);
        var xind = 0;
        const Month = 11;
        const Year = 2021;
        const yFormat = '';
        const cellSize = 55;
        var displayHeight = document.getElementById(panelId.substring(1)).clientHeight;
        var displayWidth = document.getElementById(panelId.substring(1)).clientWidth;
        var width = cellSize*9;
        var height = cellSize*8;
        const colors = d3.scaleLinear().domain([d3.min(Y),d3.max(Y)]).range(["paleturquoise", "dodgerblue"]);
        // Compute a color scale. This assumes a diverging color scheme where the pivot
        // is zero, and we want symmetric difference around zero.
        const max = d3.quantile(Y, 0.9975, Math.abs);
        const formatDay = i => "MTWTFSS"[i];
        var margin = {top: (displayHeight-height)/2, left: (displayWidth-width)/2}
        var svg = d3.select(panelId)
                    .append("svg")
                    .attr("width", displayWidth)
                    .attr("height", displayHeight)
                    .append("g")
                    .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
        for(var day of d3.range(7)) {
          svg.append("rect")
          .datum(ind+1)
          .attr("x", day*cellSize)
          .attr("y", 0)
          .attr("width", cellSize)
          .attr("height",cellSize)
          .attr("stroke","black")
          .attr("stroke-width",2)
          .attr("fill","white")
    
          svg.append("text")
              .attr("x", day*cellSize+(cellSize/3))
              .attr("y", 2*cellSize/3)
              .text(formatDay(day))
              .attr("alignment-baseline","middle")
              .style("font-size",String(cellSize/3)+"px")
        }
        
        points = d3.range(d3.min(Y),d3.max(Y),0.0005).reverse();
        sampleHeight = Math.ceil(X.length/7)*cellSize
    
        svg.append("text")
          .attr("x", cellSize*8-3*cellSize/5)
          .attr("y", 2*cellSize/3)
          .text("Hometime proportion")
          .style("font-size",String(cellSize/5)+"px")
    
        for(var ind in d3.range(points.length)) {
          svg.append("rect")
          .attr("x", cellSize*8)
          .attr("y", ind*sampleHeight/points.length+cellSize)
          .attr("fill",colors(points[ind]))
          .attr("width",cellSize/3)
          .attr("height",sampleHeight/points.length)
        }
        svg.append("text")
        .attr("x", cellSize*8+cellSize/3+3)
        .attr("y", cellSize+10)
        .text(String(d3.max(Y).toFixed(3)))
        .style("font-size",String(cellSize/5)+"px")
    
        svg.append("text")
        .attr("x", cellSize*8+cellSize/3+3)
        .attr("y", sampleHeight+cellSize-5)
        .text(String(d3.min(Y).toFixed(3)))
        .style("font-size",String(cellSize/5)+"px")
    
        for(var ind of I) {
          svg.append("rect")
              .datum(ind+1)
              .attr("x", curDay%7*cellSize)
              .attr("y", (Math.floor(curDay/7)+1)*cellSize)
              .attr("width", cellSize)
              .attr("height",cellSize)
              .attr("rx",cellSize/10)
              .attr("ry",cellSize/10)
              .attr("fill",availableDates.includes(ind+1) ? colors(Y[xind++]) : "#999997")
              .attr("stroke","black")
              .attr("stroke-width",2)
              .on("click", function(d) {
                console.log(d);
              });
          svg.append("text")
              .attr("x", curDay%7*cellSize+(cellSize/3))
              .attr("y", (Math.floor(curDay/7)+1)*cellSize+2*cellSize/3)
              .text(ind+1)
              .attr("alignment-baseline","middle")
              .style("font-size",String(cellSize/3)+"px");
          curDay += 1;
        }
        
      }