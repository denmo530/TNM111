function combineEpisodes() {
  let allData = [];

  for (let i = 1; i < 8; i++) {
    d3.json(
      `./starwars-interactions/starwars-episode-${i}-interactions-allCharacters.json`,
      (data) => {
        // Update source and target id to name
        data.links.map((link) => {
          link.source = data.nodes[link.source].name;
          link.target = data.nodes[link.target].name;
        });

        allData.push(data);
      }
    );
  }

  // let combinedData = { nodes, links };

  return allData;
}

let allData = combineEpisodes();

d3.json(
  "./starwars-interactions/starwars-full-interactions-allCharacters.json",
  (data) => {
    data.links.map((link) => {
      link.source = data.nodes[link.source].name;
      link.target = data.nodes[link.target].name;
    });

    let graph1 = drawGraph(data, "all", 1);
    let graph2 = drawGraph(data, "episodes", 2);

    graph1.node.on("mouseover", highlightNode);
    graph2.node.on("mouseover", highlightNode);

    graph1.node.on("mouseout", resetNode);
    graph2.node.on("mouseout", resetNode);

    characterMenu(data);

    function resetNode() {
      // Reset style
      d3.select(this).attr("fill", (n) => n.colour);

      // label.attr("opacity", 1);

      graph1.node.transition().attr("opacity", 1.0);
      graph2.node.transition().attr("opacity", 1.0);

      graph1.link.transition().attr("opacity", 1.0);
      graph2.link.transition().attr("opacity", 1.0);

      d3.select("#toolTip").style("visibility", "hidden");
    }

    createEpisodeSelect();

    function createEpisodeSelect() {
      let dropdownList = document.getElementById("dropdown-list2");

      let episodes = [1, 2, 3, 4, 5, 6, 7];

      episodes.forEach((episode) => {
        let label = document.createElement("label");
        let input = document.createElement("input");

        input.type = "checkbox";
        input.name = episode.toString();
        input.class = "episode-checkbox";
        input.value = episode;

        input.onclick = function (event) {
          let checkedBoxes = document.querySelectorAll(
            "#dropdown-list2 input[type=checkbox]:checked"
          );

          if (checkedBoxes.length > 0) {
            newData = filterEpisodeData(event.target.value);
          } else {
            newData = data;
          }

          // let data = filterEpisodeData(event.target.value);
          d3.select("#graph-2").remove();

          graph2 = drawGraph(newData, "episode", 2);
          graph2.link.data(newData.links);

          graph2.node
            .enter()
            .append("circle")
            .attr("cx", function (d) {
              return d.x;
            })
            .attr("cy", function (d) {
              return d.y;
            })
            .attr("r", function (d) {
              return d.r;
            });

          graph2.node.exit().remove();

          graph2.node.on("mouseover", highlightNode);
          graph2.node.on("mouseout", resetNode);
        };

        label.innerHTML = episode.toString();
        label.htmlFor = episode.toString();

        label.appendChild(input);
        dropdownList.appendChild(label);
      });
    }

    function highlightNode() {
      // Uncheck checked boxes
      // let checkedBoxes = document.querySelectorAll(
      //   "input[type=checkbox]:checked"
      // );
      // checkedBoxes.forEach((box) => (box.checked = false));

      let text = `Name: ${
        d3.select(this).data()[0].name
      } <br> Number of scenes: ${d3.select(this).data()[0].value}`;
      graph1.toolTip.html(text);

      graph1.toolTip.style("visibility", "visible");

      graph1.toolTip.style("top", 0).style("left", 0);

      // Lower opacity on all nodes and links
      graph1.node.transition().attr("opacity", 0.3);
      graph2.node.transition().attr("opacity", 0.3);

      graph1.link.transition().attr("opacity", 0.1);
      graph2.link.transition().attr("opacity", 0.1);

      // Set opacity to 1 on hovered nodes
      let id = d3.select(this).attr("class");
      id = id.split(" ")[0];

      d3.selectAll(`.${id}`).transition().attr("opacity", 1);

      let nodeName = id.split(" ")[0].replace("node-", "").replace(/ /g, "");

      graph1.link.data().forEach((item) => {
        if (
          item.source.name.replace(/ /g, "") === nodeName ||
          item.target.name.replace(/ /g, "") === nodeName
        ) {
          graph1.link
            .filter((l) => l.index == item.index)
            .transition()
            .attr("opacity", 1)
            .attr("stroke-width", 2);
        }
      });

      graph2.link.data().forEach((item) => {
        if (
          item.source.name.replace(/ /g, "") === nodeName ||
          item.target.name.replace(/ /g, "") === nodeName
        ) {
          graph2.link
            .filter((l) => l.index == item.index)
            .transition()
            .attr("opacity", 1)
            .attr("stroke-width", 2);
        }
      });
    }

    /**
     * Function to render character menu
     * @param {*} data
     */
    function characterMenu(data) {
      let mainCharacters = getMainCharacters(data);
      let dropdownList = document.getElementById("dropdown-list1");
      mainCharacters = new Set(mainCharacters);

      mainCharacters.forEach((character) => {
        let label = document.createElement("label");
        let input = document.createElement("input");

        label.text = character.name;
        input.type = "checkbox";
        input.name = character.name;
        input.value = character.name;
        input.onclick = function (event) {
          characterClick(graph1.link, graph1.node);
          characterClick(graph2.link, graph2.node);
        };

        label.innerHTML = character.name;
        label.htmlFor = character.name;

        label.appendChild(input);
        dropdownList.appendChild(label);
      });
    }
  }
);
