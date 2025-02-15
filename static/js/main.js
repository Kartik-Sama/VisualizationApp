queue()
    .defer(d3.json, renderUrl)
    .defer(d3.json, surveyVizUrl)
    .defer(d3.json, sigLocUrl)
    .await(ready);

function ready(error, state, surData, sigLocData) {
    var metaData = state[2]
    if(metaData['f'] == 'Survey PCA Trend') {
        d3TimeLine(surData[0]);
    }
    if(metaData['f'] == 'Survey PCA Scatter') {
        d3Scatter(surData[0]);
    }
    else if(metaData['f'] == 'Eigen Gap') {
        d3BarChart(surData[0]);
    }
    else if(metaData['f'] == 'Survey Performance') {
        d3heatMap(surData[0]);
    }
    else if(metaData['f'] == 'Significant Location') {
        calendarPie(sigLocData[0]);
    }
    else if(metaData['f'] == 'Hometime') {
        p1Calendar(sigLocData[0]);
    }

    var metaData = state[3]
    if(metaData['f'] == 'Survey PCA Trend') {
        d3TimeLine(surData[1]);
    }
    if(metaData['f'] == 'Survey PCA Scatter') {
        d3Scatter(surData[1]);
    }
    else if(metaData['f'] == 'Eigen Gap') {
        d3BarChart(surData[1]);
    }
    else if(metaData['f'] == 'Survey Performance') {
        d3heatMap(surData[1]);
    }
    else if(metaData['f'] == 'Significant Location') {
        calendarPie(sigLocData[1]);
    }
    else if(metaData['f'] == 'Hometime') {
        p1Calendar(sigLocData[1]);
    }
        
}   