console.log("Loading graph logic");
var viewport_w = document.body.clientWidth;
var tasks_width = document.getElementById("myTasks").clientWidth;
console.log(viewport_w + "--" + tasks_width);
var w = viewport_w - tasks_width - 20;
var h = document.body.clientHeight;

var labelDistance = 0;
var Graph = function () {
    // here we setup the stage for vizualization
    var stage = d3.select("#myGraph")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    // we use this things to draw our graph
    var nodes = [];
    var links = []; //links are linking nodes based on their index inside of the array

    var labelAnchors = [];
    var labelAnchorLinks = [];

    // I'll have to change this code
    for (var i = 0; i < 30; i++) {
        var node = {
            label: "My long ass task: " + i
        };

        nodes.push(node);
        //our label anchors have refernce to the node that they are attached to
        labelAnchors.push({
            node: node
        });

        labelAnchors.push({
            node: node
        });
    };

    // we link our node to all of the previous nodes with probability 95%
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < i; j++) {

            if (Math.random() > .95)
                links.push({
                    source: i,
                    target: j,
                    weight: Math.random() //we use it to define link strenght
                });

        }
        labelAnchorLinks.push({
            source: i * 2,
            target: i * 2 + 1,
            weight: 1
        });
    };

    var force = d3.layout.force()
        .size([w, h])
        .nodes(nodes)
        .links(links)
        .gravity(1)
        .linkDistance(50)
        .charge(-3000)
        .linkStrength(function (x) {
            return x.weight * 10
        });


    force.start();

    // we are creating a different graph for labels
    var force2 = d3.layout.force()
        .nodes(labelAnchors)
        .links(labelAnchorLinks)
        .gravity(0)
        .linkDistance(0)
        .linkStrength(8)
        .charge(-100)
        .size([w, h]);

    force2.start();

    // Here we start creating markup for the nodes
    var link = stage.selectAll("line.link")
        .data(links)
        .enter()
        .append("svg:line")
        .attr("class", "link")
        .style("stroke", "#CCC");

    var node = stage.selectAll("g.node")
        .data(force.nodes())
        .enter()
        .append("svg:g")
        .attr("class", "node");

    node.append("svg:circle")
        .attr("r", 5)
        .style("fill", "#555")
        .style("stroke", "#FFF")
        .style("stroke-width", 3);

    node.call(force.drag);


    var anchorLink = stage.selectAll("line.anchorLink")
        .data(labelAnchorLinks);

    var anchorNode = stage.selectAll("g.anchorNode")
        .data(force2.nodes())
        .enter()
        .append("svg:g")
        .attr("class", "anchorNode");

    anchorNode
        .append("svg:circle")
        .attr("r", 0)
        .style("fill", "#FFF");

    anchorNode
        .append("svg:text")
        .text(function (d, i) {
            return i % 2 == 0 ? "" : d.node.label
        })
        .style("fill", "#555")
        .style("font-family", "Arial")
        .style("font-size", 12);

    var updateLink = function () {
        this.attr("x1", function (d) {
            return d.source.x;
        }).attr("y1", function (d) {
            return d.source.y;
        }).attr("x2", function (d) {
            return d.target.x;
        }).attr("y2", function (d) {
            return d.target.y;
        });

    }

    var updateNode = function () {

        this.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    }

    // this part is doing life updates
    force.on("tick", function () {

        force2.start();

        node.call(updateNode);

        anchorNode.each(function (d, i) {
            if (i % 2 == 0) {
                d.x = d.node.x;
                d.y = d.node.y;
            } else {
                var b = this.childNodes[1].getBBox();

                var diffX = d.x - d.node.x;
                var diffY = d.y - d.node.y;

                var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                var shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                var shiftY = 5;
                this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
            }
        });


        anchorNode.call(updateNode);

        link.call(updateLink);
        anchorLink.call(updateLink);

    });
}