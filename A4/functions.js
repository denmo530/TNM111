/**
 * MAIN CHARACTER FUNCTIONS
 */
function getMainCharacters(data) {
  const mainChars = data.nodes.filter((char) => char.colour !== "#808080");

  return mainChars;
}

/**
 * Function to handle click on character
 * @param {*} event
 */
function characterClick(event, link, node) {
  let checkedBoxes = document.querySelectorAll("input[type=checkbox]:checked");

  let checkedNames = Array.prototype.slice
    .call(checkedBoxes)
    .map((box) => box.name);

  if (checkedNames.length > 0) {
    node.transition().attr("opacity", 0.3);
    link.attr("opacity", 0.1);

    checkedNames.map((char) => {
      d3.selectAll(".node-" + char.replace(/ /g, ""))
        .transition()
        .attr("opacity", 1.0);

      let d = d3.select(".node-" + char.replace(/ /g, "")).data()[0];

      link.data().forEach((item) => {
        if (item.source.index === d.index || item.target.index === d.index) {
          link
            .filter((l) => l.index == item.index)
            .transition()
            .attr("opacity", 1)
            .attr("stroke-width", 2);
        }
      });
    });
  } else {
    // No names selected
    node.transition().attr("opacity", 1);
    link.transition().attr("opacity", 1).attr("stroke-width", 2);
  }
}
/**
 * Function to filter and combine data from multiple episodes
 * @returns
 */
function filterEpisodeData(originData) {
  let checkedBoxes = document.querySelectorAll(
    "#dropdown-list2 input[type=checkbox]:checked"
  );
  let filteredData = [];

  // Add data from episode that corresponds to checkboxes
  if (checkedBoxes.length > 0) {
    checkedBoxes.forEach((box) => filteredData.push(allData[box.value - 1]));
  } else {
    return originData;
  }

  // Extract nodes and links from data
  let nodes = filteredData.map((item) => item.nodes);
  let links = filteredData.map((item) => item.links);

  let uniqueNodes = [];
  let uniqueLinks = [];

  // Loop through all episodes in nodes
  for (let index = 0; index < nodes.length; index++) {
    let episodeNodes = nodes[index];
    let episodeLinks = links[index];

    // Loop through all nodes in current episodes
    episodeNodes.forEach((currNode, i) => {
      // Check if name already exists in uniqueNodes
      if (uniqueNodes.some((node) => node.name === currNode.name)) {
        let uniqueNodesIndex = uniqueNodes.findIndex(
          (node) => node.name === currNode.name
        );

        // Increase value of existing node
        uniqueNodes[uniqueNodesIndex].value += currNode.value;

        // Update source and target on all connected links to current node
        episodeLinks.map((link) => {
          if (link.target === i) {
            return { ...link, target: uniqueNodesIndex };
          } else if (link.source === i) {
            return { ...link, source: uniqueNodesIndex };
          }
          return link;
        });
      } else {
        uniqueNodes.push(currNode);
      }
    });

    episodeLinks.forEach((link) => {
      const containsLink = uniqueLinks.some(
        (obj) => obj.target === link.target && obj.source === link.source
      );
      if (containsLink) {
        // Add values on same links
        let index = uniqueLinks.findIndex(
          (obj) => obj.target === link.target && obj.source === link.source
        );
        uniqueLinks[index].value += link.value;
      } else {
        // Link does not exists
        uniqueLinks.push(link);
      }
    });
  }

  let combinedData = { nodes: uniqueNodes, links: uniqueLinks };
  console.log(combinedData);
  return combinedData;
}

/**
 * Main function to draw graph
 * @param {*} data
 * @param {*} type
 * @returns
 */
function drawGraph(data, type, graphIndex) {
  let originData = data;
  let checkedBoxes = document.querySelectorAll(
    "#dropdown-list2 input[type=checkbox]:checked"
  );

  if (type === "episodes" && checkedBoxes.length > 0) {
    data = filterEpisodeData(originData);
  }

  // Set size of window for graph and margins
  let margin = { top: 10, right: 30, bottom: 30, left: 40 };
  let width = 1000 - margin.left - margin.right;
  let height = 1300 - margin.top - margin.bottom;

  let svg = d3
    .select("#graph")
    .append("svg")
    .attr("id", `graph-${graphIndex}`)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke-width", 2)
    .classed("link", true);

  let linkLabel = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "#626D71")
    .style("border-radius", "6px")
    .style("text-align", "center")
    .style("width", "auto")
    .style("height", "auto")
    .style("visibility", "hidden");

  let node = svg
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("g")
    .append("circle")
    .attr("r", 15)
    .attr("fill", (d) => d.colour)
    .attr("class", (d) => "node-" + d.name.replace(/ /g, ""))
    .classed("fixed", (d) => d.fx !== undefined)
    .classed("nodes", true)
    .call(
      d3.drag().on("start", dragStarted).on("drag", dragged)
      // .on("end", dragEnded)
    );

  /**
   * HOVER FUNCTIONS
   */

  link.on("mouseover", function (d) {
    link.attr("opacity", 0.2);
    d3.select(this).attr("opacity", 1);

    // linkLabel.text("Link from " + d.source.name + " to " + d.target.name);
    let text = `Link from ${d.source.name} to ${d.target.name} <br> Number of interactions: ${d.value}`;
    linkLabel.html(text);
    linkLabel.style("visibility", "visible");
  });

  link.on("mousemove", function (d) {
    var mousePos = d3.mouse(svg.node());
    // linkLabel.attr("x", mousePos[0] + 10).attr("y", mousePos[1] + 10);
    linkLabel
      .style("top", d3.event.pageY - 10 + "px")
      .style("left", d3.event.pageX - 10 + "px");
  });

  link.on("mouseout", function (d) {
    link.attr("opacity", 1);
    linkLabel.style("visibility", "hidden");
  });

  // Tooltip
  let toolTip = d3
    .select("body")
    .append("div")
    .attr("id", "toolTip")
    .style("position", "absolute")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "#626D71")
    .style("border-radius", "6px")
    .style("text-align", "center")
    .style("width", "auto")
    .style("height", "auto")
    .style("visibility", "hidden")
    .text("");

  /**
   * SIMULATION
   */

  let simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id((d) => d.index)
    )
    .force("center", d3.forceCenter(width / 2, height / 3))
    .force("collission", d3.forceCollide().radius(35))
    .force("charge", d3.forceManyBody().strength(-20));

  simulation.nodes(data.nodes).on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    // label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  simulation.force("link").links(data.links);

  /**
   * NODE DRAG FUNCTIONS
   */
  function dragStarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    // Check
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  return { node, link, toolTip, svg };
}
