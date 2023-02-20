function combineEpisodes() {
  const allData = [];

  for (let i = 1; i < 8; i++) {
    d3.json(
      `./starwars-interactions/starwars-episode-${i}-interactions-allCharacters.json`,
      (data) => {
        allData.push(data);
      }
    );
  }

  return allData;
}

let allData = combineEpisodes();

console.log(allData);

d3.json(
  "./starwars-interactions/starwars-full-interactions-allCharacters.json",
  (data) => {
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
          let data = filterEpisodeData(event.target.value);

          // graph2.node.remove();
          // graph2.link.remove();
          // graph2.select("#graph").remove();
          d3.select("#graph-2").remove();

          graph2 = drawGraph(data, "episode", 2);
          graph2.link.data(data.links);

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

    // /**
    //  * DRAG FUNCTIONS
    //  * @param {*} d
    //  */
    // function dragStarted(d) {
    //   if (!d3.event.active) simulation.alphaTarget(0.03).restart();
    //   d.fx = d.x;
    //   d.fy = d.y;
    // }

    // function dragged(d) {
    //   // Check
    //   d.fx = d3.event.x;
    //   d.fy = d3.event.y;
    // }

    function highlightNode() {
      let text = `Name: ${
        d3.select(this).data()[0].name
      } <br> Number of scenes: ${d3.select(this).data()[0].value}`;
      graph1.toolTip.html(text);

      graph1.toolTip.style("visibility", "visible");

      graph1.toolTip.style("top", 0).style("left", 0);

      let id = d3.select(this).attr("class");

      graph1.node.transition().attr("opacity", 0.3);
      graph2.node.transition().attr("opacity", 0.3);

      graph1.link.transition().attr("opacity", 0.1);
      graph2.link.transition().attr("opacity", 0.1);

      // Set opacity to 1 on hovered nodes

      id = id.split(" ")[0];
      console.log(id);
      d3.selectAll(`.${id}`).transition().attr("opacity", 1);

      graph1.link.data().forEach((item) => {
        console.log(item);
        console.log(d3.selectAll(`.${id}`));

        if (
          item.source.index === d3.select(`.${id}`).data()[0].index ||
          item.target.index === d3.select(`.${id}`).data()[0].index
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
          item.source.index === d3.select(`.${id}`).data()[0].index ||
          item.target.index === d3.select(`.${id}`).data()[0].index
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
    function characterMenu(data, link, node) {
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
          characterClick(event.target.name, graph1.link, graph1.node);
          characterClick(event.target.name, graph2.link, graph2.node);
        };

        label.innerHTML = character.name;
        label.htmlFor = character.name;

        label.appendChild(input);
        dropdownList.appendChild(label);
      });
    }
  }
);
