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
    // We are using this link to attach text to our node
    labelAnchorLinks.push({
        source: i * 2,
        target: i * 2 + 1,
        weight: 1
    });
};
/*
Below this part we are having our graph setup
*/

// here we setup the stage for vizualization
var stage = d3.select("#myGraph")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h);




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


    // We use this to make our Links move


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

// We use our nodes to make them move
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

force = force.stop();
force2 = force2.stop();
/*
=======================================
In this part we are testing our INSERTS
=======================================
- We insert our delete our new nodes. We delete them from out visualizatiion underlying model.
    * After, we have delted them all we have left is views that need to be updated
- We update our links
- We restart our simulation
    * restart simulation deletes and creates new markup elements

TIP:
- When you are working with the graph, it's easier to do model then controller and then view. Instead of doing them togehter.
*/

// WE ARE ADDING STRUCTURE GRAPH MODEL
var myNewNode = {
    label: "MY VERY SPECIAL TASK"
};
nodes.push(myNewNode);

links.push({
    source: nodes.length - 1,
    target: 1,
    weight: 1
});


// WE ARE ADDING TEXT GRAPH MODEL
labelAnchors.push({
    node: myNewNode
});

labelAnchors.push({
    node: myNewNode
});

// TODO: I have an error here, apparently found_at is not returning right index
labelAnchorLinks.push({
    source: 60,
    target: 61,
    weight: Math.random()
});


// console.log(labelAnchorLinks);
// /*
// data() function puts markup elements and data objects together
// */
force.nodes(nodes);
force.links(links);

force2.nodes(labelAnchors);
force2.links(labelAnchorLinks);


// /*
// ========================================
// We are updating markup part of our code
// ========================================
// */
var link = stage.selectAll("line.link").data(force.links(), function (d) { return d; });
link.exit().remove();

link.enter()
    .append("svg:line")
    .attr("class", "link")
    .style("stroke", "#CCC");


var node = stage.selectAll("g.node").data(force.nodes(), function (d) { return d; });

node.exit().remove();
node.enter()
    .append("svg:g")
    .attr("class", "node");

node.append("svg:circle")
    .attr("r", 5)
    .style("fill", "#555")
    .style("stroke", "#FFF")
    .style("stroke-width", 3);

node.call(force.drag);

/*
After we have inserted our elements the data behind markup has changed so new elements have to be reassigned
- We need to remove markup elements that don't have data behind them remove them and rerender
*/


// UPDATE VIEW FOR TEXT GRAPH
var anchorLink = stage.selectAll("line.anchorLink").data(force2.links(), function (d) { return d; });

anchorLink.exit().remove();

var anchorNode = stage.selectAll("g.anchorNode").data(force2.nodes(), function (d) { return d; });

anchorNode.exit().remove();
anchorNode.enter()
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

force.start();
force2.start(); 


// EXTRA STUFF BELOW

/*
exit()
- it finds elements that have markup but no data elements
- remove() is removign such elements
currentNode.exit().remove();
*/

/*
merge()
    Returns a new select    ion merging this selection with the specified other selection. 
    The returned selection has the same number of groups and the same parents as this selection. 
    Any missing (null) elements in this selection are filled with the corresponding element, if present (not null), 
    from the specified selection. (If the other selection has additional groups or parents, they are ignored.)
*/



// We are doing the same thing we did with our nodes
/*
    We are selecting lings and then we delete nodes that have marckup but not data behind it


    we merge in the data
*/
// link = link.enter()
//     .append("svg:line")
//     .attr("class", "link")
//     .style("stroke", "#CCC");
//    // .merge(link); // we are appending new link here

//force.links(links);
// force.alpha(1).restart();
// force2.alpha(1).restart();
// force2 I need to update text links as well