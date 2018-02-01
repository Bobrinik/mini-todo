console.log("Loading graph logic");
var viewport_w = document.body.clientWidth;
var tasks_width = document.getElementById("myTasks").clientWidth;
console.log(viewport_w + "--" + tasks_width);
var w = viewport_w - tasks_width - 20;
var h = document.body.clientHeight;

var labelDistance = 0;

// we use this things to draw our graph
var nodes = [];
var links = []; //links are linking nodes based on their index inside of the array

nodes.push({ id: 0, label: "My Simple Task" });
nodes.push({ id: 1, label: "Another task" });
links.push({ target: 0, source: 1 });

// https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811
const svg = d3.select('#myGraph')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

const nodeElements = svg.append('g').selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', 10)
    .attr('fill', "black");

const textElements = svg.append('g').selectAll('text')
    .data(nodes)
    .enter().append('text')
    .text(node => node.label)
    .attr('font-size', 15)
    .attr('dx', 15)
    .attr('dy', 4);

const linkElements = svg.append('g').selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke-width', 1)
    .attr('stroke', 'green');

    
const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-20))
    .force('center', d3.forceCenter(w / 2, h / 2));


simulation.nodes(nodes).on('tick', () => {
    nodeElements
        .attr("cx", node => node.x)
        .attr("cy", node => node.y)
    textElements
        .attr("x", node => node.x)
        .attr("y", node => node.y)
    linkElements
        .attr('x1', link => link.source.x)
        .attr('y1', link => link.source.y)
        .attr('x2', link => link.target.x)
        .attr('y2', link => link.target.y)
});

simulation.force('link', d3.forceLink()
    .id(function (link) { return link.id })
    .strength(function (link) { return 0.7 }));

simulation.force('link').links(links);