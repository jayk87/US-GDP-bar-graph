var width = 700,
height = 350,
padding = 75,
barWidth = width / 275;

var parseTime = d3.timeParse("%Y-%m-%d");

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").
then(response => response.json()).
then(fetchedData => {

  var data = fetchedData.data;

  var tooltipTime = d => {
    if (d[0].slice(5, 7) == '01') {
      return d[0].slice(0, 7).replace('-01', ' Q1');
    } else if (d[0].slice(5, 7) == '04') {
      return d[0].slice(0, 7).replace('-04', ' Q2');
    } else if (d[0].slice(5, 7) == '07') {
      return d[0].slice(0, 7).replace('-07', ' Q3');
    } else if (d[0].slice(5, 7) == '10') {
      return d[0].slice(0, 7).replace('-10', ' Q4');
    }
  };

  var tooltipGDP = d => {
    if (d[1] >= 1000) {
      return '$' + (d[1] / 1000).toFixed(2) + ' Trillion';
    } else {
      return '$' + d[1].toFixed(2) + " Billion";
    }
  };
  //     data.forEach(function (d) {

  //       d[0] = parseTime(d[0]);
  //       // d[1] = +d[1];
  //     })


  var GDP = data.map(item => item[1]);
  var date = data.map(item => parseTime(item[0]));
  var xScale = d3.scaleTime().
  domain([d3.min(date), d3.max(date)]).
  range([0, width]);
  var yScale = d3.scaleLinear().
  domain([0, d3.max(GDP)]).
  range([height, 0]);
  const svg = d3.select('#chart').
  append('svg').
  attr('width', width + padding + 20).
  attr('height', height + padding).
  style('fill', 'black');

  const tooltip = d3.select('#chart').
  append("div").
  style("visibility", "hidden").
  style('position', 'absolute').
  attr('id', 'tooltip').
  style('background-color', 'grey');

  svg.selectAll('rect').
  data(data).
  enter().
  append('rect').
  attr('data-date', (d, i) => d[0]).
  attr('data-gdp', (d, i) => d[1]).
  attr('x', (d, i) => padding + i * width / 275).
  attr('y', (d, i) => yScale(d[1]) + 10).
  attr('width', width / 275).
  attr('height', (d, i) => height - yScale(d[1])).
  attr('class', 'bar').
  on("mouseover", function (d, i) {
    return (
      tooltip.style("visibility", 'visible').
      html(
      tooltipTime(i) +
      '<br>' + tooltipGDP(i))
      // .style("left", 200 + "px")
      .attr('data-date', i[0]).
      style('left', event.pageX + 5 + "px").
      style('top', event.pageY - 35 + 'px')
      //                .style('top', height - 100 + 'px')
    );
    //                .style('transform', 'translateX(60px)')
  }).
  on("mouseout", (d, i) => {
    tooltip.style("visibility", 'hidden');
  });


  const xAxis = d3.axisBottom(xScale).
  tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale);

  svg.append('g').
  attr('transform', 'translate(' + padding + ',' + (height + 10) + ")").
  attr('id', "x-axis").
  call(xAxis);

  svg.append('g').
  call(yAxis).
  attr('id', 'y-axis').
  attr('transform', 'translate(' + padding + ',10)');




  //    // .attr('y', (d,i)=> h - d)
  //  console.log(d3.max(date));

});