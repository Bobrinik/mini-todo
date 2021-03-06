
var myGraph = (function () {
    // We are finding size to fit exactly to the the right of the task list
    let tasks_width = document.getElementById("myTasks").clientWidth;
    let w = viewport_w - tasks_width - 20;
    let h = document.body.clientHeight;


    // we use this things to draw our graph
    var nodes = [];
    var links = []; //links are linking nodes based on their index inside of the array

    // nodes.push({ id: 0, label: "My Simple Task" });
    // nodes.push({ id: 1, label: "Another task" });
    // links.push({ target: 0, source: 1 });

    function getNeighbors(node) {
        return baseLinks.reduce(function (neighbors, link) {
            if (link.target.id === node.id) {
                neighbors.push(link.source.id)
            } else if (link.source.id === node.id) {
                neighbors.push(link.target.id)
            }
            return neighbors
        },
            [node.id]
        )
    }

    function isNeighborLink(node, link) {
        return link.target.id === node.id || link.source.id === node.id
    }


    let svg = d3.select('#myGraph').append("svg").attr('width', w).attr('height', h)

    let linkElements,
        nodeElements,
        textElements;

    // we use svg groups to logically group the elements together
    var linkGroup = svg.append('g').attr('class', 'links');
    var nodeGroup = svg.append('g').attr('class', 'nodes');
    var textGroup = svg.append('g').attr('class', 'texts');

    // we use this reference to select/deselect
    // after clicking the same element twice
    var selectedId

    // simulation setup with all forces
    var linkForce = d3
        .forceLink()
        .id(function (link) { return link.id })
        .strength(0.7)

    var simulation = d3
        .forceSimulation()
        .force('link', linkForce)
        .force('charge', d3.forceManyBody().strength(-2))
        .force('center', d3.forceCenter(w / 2, h / 2))

    var dragDrop = d3.drag().on('start', function (node) {
        node.fx = node.x
        node.fy = node.y
    }).on('drag', function (node) {
        simulation.alphaTarget(0.7).restart()
        node.fx = d3.event.x
        node.fy = d3.event.y
    }).on('end', function (node) {
        if (!d3.event.active) {
            simulation.alphaTarget(0)
        }
        node.fx = null
        node.fy = null
    })

    // select node is called on every click
    // we either update the data according to the selection
    // or reset the data if the same node is clicked twice
    function selectNode(selectedNode) {
        if (selectedId === selectedNode.id) {
            selectedId = undefined
            resetData()
            updateSimulation()
        } else {
            selectedId = selectedNode.id
            updateData(selectedNode)
            updateSimulation()
        }
    }

    // this helper simple adds all nodes and links
    // that are missing, to recreate the initial state
    function resetData() {
        var nodeIds = nodes.map(function (node) { return node.id })

        baseNodes.forEach(function (node) {
            if (nodeIds.indexOf(node.id) === -1) {
                nodes.push(node)
            }
        })

        links = baseLinks
    }

    // diffing and mutating the data
    function updateData(selectedNode) {
        var neighbors = getNeighbors(selectedNode)
        var newNodes = baseNodes.filter(function (node) {
            return neighbors.indexOf(node.id) > -1 || node.level === 1
        })

        var diff = {
            removed: nodes.filter(function (node) { return newNodes.indexOf(node) === -1 }),
            added: newNodes.filter(function (node) { return nodes.indexOf(node) === -1 })
        }

        diff.removed.forEach(function (node) { nodes.splice(nodes.indexOf(node), 1) })
        diff.added.forEach(function (node) { nodes.push(node) })

        links = baseLinks.filter(function (link) {
            return link.target.id === selectedNode.id || link.source.id === selectedNode.id
        })
    }

    function updateGraph() {
        // links
        linkElements = linkGroup.selectAll('line')
            .data(links, function (link) {
                return link.target.id + link.source.id
            })

        linkElements.exit().remove()

        var linkEnter = linkElements
            .enter().append('line')
            .attr('stroke-width', 1)
            .attr('stroke', 'rgba(50, 50, 50, 0.2)')

        linkElements = linkEnter.merge(linkElements)

        // nodes
        nodeElements = nodeGroup.selectAll('circle')
            .data(nodes, function (node) { return node.id })

        nodeElements.exit().remove()

        var nodeEnter = nodeElements
            .enter()
            .append('circle')
            .attr('r', 10)
            .attr('fill', "black")
            .call(dragDrop)
            // we link the selectNode method here
            // to update the graph on every click
            .on('click', selectNode)

        nodeElements = nodeEnter.merge(nodeElements)

        // texts
        textElements = textGroup.selectAll('text')
            .data(nodes, function (node) { return node.id })

        textElements.exit().remove()

        var textEnter = textElements
            .enter()
            .append('text')
            .text(function (node) { return node.label })
            .attr('font-size', 15)
            .attr('dx', 15)
            .attr('dy', 4)

        textElements = textEnter.merge(textElements)
    }

    function updateSimulation() {
        updateGraph();

        simulation.nodes(nodes).on('tick', () => {
            nodeElements
                .attr('cx', function (node) { return node.x })
                .attr('cy', function (node) { return node.y })
            textElements
                .attr('x', function (node) { return node.x })
                .attr('y', function (node) { return node.y })
            linkElements
                .attr('x1', function (link) { return link.source.x })
                .attr('y1', function (link) { return link.source.y })
                .attr('x2', function (link) { return link.target.x })
                .attr('y2', function (link) { return link.target.y })
        })

        simulation.force('link').links(links)
        simulation.alphaTarget(0.7).restart()
    }

    // last but not least, we call updateSimulation
    // to trigger the initial render
    updateSimulation()

    function add(node, linker) {
        nodes.push(node);
        linker(links);
        updateSimulation();
    }
    function remove(node){
        // add remove logic
        updateSimulation()
    }

    // TODO: We are just updating the label and not other properties
    function update(nodeId, label){
        nodes.forEach(node =>{
            if(node.id == nodeId){
                node.label = label;
                console.log("found");
            }
        });
        updateSimulation();
    }

    return {
        add: add,
        remove: remove,
        update: update
    };
})();