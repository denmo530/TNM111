// Set size of window for graph and margins
let margin = { top: 10, right: 30, bottom: 30, left: 40 };
let width = 1000 - margin.left - margin.right;
let height = 1000 - margin.top - margin.bottom;

let dropdownList = document.getElementById("dropdown-list");

let svg = d3
  .select("#graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(
  "./starwars-interactions/starwars-episode-1-interactions-allCharacters.json",
  (data) => {
    console.log(data);

    let link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke-width", 1)
      .classed("link", true);

    let linkLabel = svg
      .append("text")
      .attr("class", "link-label")
      .style("visibility", "hidden");

    let node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 12)
      .attr("fill", (d) => d.colour)
      .classed("fixed", (d) => d.fx !== undefined)
      .call(
        d3.drag().on("start", dragStarted).on("drag", dragged)
        // .on("end", dragEnded)
      );

    /**
     * LABELS
     */
    node.append("title").text((d) => `${d.name}\nValue: ${d.value}`);

    link.on("mouseover", function (d) {
      link.attr("opacity", 0.2);
      d3.select(this).attr("opacity", 1);
      linkLabel.text("Link from " + d.source.name + " to " + d.target.name);
      linkLabel.style("visibility", "visible");
    });

    link.on("mousemove", function (d) {
      var mousePos = d3.mouse(svg.node());
      linkLabel.attr("x", mousePos[0] + 10).attr("y", mousePos[1] + 10);
    });

    link.on("mouseout", function (d) {
      link.attr("opacity", 1);
      linkLabel.style("visibility", "hidden");
    });

    // node
    //   .append("svg:text")
    //   .attr("x", 10)
    //   .attr("dy", "1em")
    //   .text(function (d) {
    //     return d.name;
    //   });

    /**
     * HOVER STYLE
     */

    // Add mouseover on the nodes
    node.on("mouseover", function (d) {
      // Lower opacity on all nodes
      node.transition().attr("opacity", 0.3);
      link.attr("opacity", 0.1);

      // Style for active node
      d3.select(this).transition().attr("opacity", 1);

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

    node.on("mouseout", function (d) {
      // Reset style
      d3.select(this).attr("fill", (n) => n.colour);
      node.transition().attr("opacity", 1);
      link.attr("opacity", 1);
    });

    /**
     * SIMULATION
     */

    let simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id((d) => d.index)
      )
      .force("center", d3.forceCenter(width / 2, height / 4))
      .force("collission", d3.forceCollide().radius(30))
      .force("charge", d3.forceManyBody().strength(-20));

    simulation.nodes(data.nodes).on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    simulation.force("link").links(data.links);

    let mainCharacters = getMainCharacters(data);

    mainCharacters.forEach((character) => {
      let label = document.createElement("label");
      let input = document.createElement("input");

      label.text = character.name;
      input.type = "checkbox";
      input.name = character.name;
      input.value = character.name;
      input.onclick = function (event) {
        characterClick(event.target.name);
      };

      label.innerHTML = character.name;
      label.htmlFor = character.name;

      label.appendChild(input);
      dropdownList.appendChild(label);
    });

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

    /**
     * MAIN CHARACTER FUNCTIONS
     */
    function getMainCharacters() {
      const mainChars = data.nodes.filter((char) => char.colour !== "#808080");
      //   let positions = mainChars.map((char) => {
      //   });
      return mainChars;
    }

    function characterClick(event) {
      let mainCharacters = getMainCharacters();
      console.log(mainCharacters);
      let checkedBoxes = document.querySelectorAll(
        "input[type=checkbox]:checked"
      );
      console.log(checkedBoxes);

      let checkedNames = Array.prototype.slice
        .call(checkedBoxes)
        .map((box) => box.name);
      console.log(checkedNames);

      d3.select("#node-" + nodeId)
        .classed("highlighted", true)
        .style("stroke-width", "2px");

      console.log(filteredData);
    }
  }
);
