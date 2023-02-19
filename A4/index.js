// function drawGraph(data) {
//   // Set size of window for graph and margins
//   let margin = { top: 10, right: 30, bottom: 30, left: 40 };
//   let width = 1000 - margin.left - margin.right;
//   let height = 1000 - margin.top - margin.bottom;

//   let dropdownList = document.getElementById("dropdown-list");

//   let svg = d3
//     .select("#graph")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   //   d3.json(
//   //     "./starwars-interactions/starwars-episode-1-interactions-allCharacters.json",
//   //     (data) => {
//   console.log(data);

//   let link = svg
//     .append("g")
//     .attr("class", "links")
//     .selectAll("line")
//     .data(data.links)
//     .enter()
//     .append("line")
//     .attr("stroke-width", 1)
//     .classed("link", true);

//   let linkLabel = svg
//     .append("text")
//     .attr("class", "link-label")
//     .style("visibility", "hidden");

//   let node = svg
//     .attr("class", "nodes")
//     .selectAll("circle")
//     .data(data.nodes)
//     .enter()
//     .append("g")
//     .append("circle")
//     .attr("r", 30)
//     .attr("fill", (d) => d.colour)
//     .classed("fixed", (d) => d.fx !== undefined)
//     .classed("nodes", true)
//     .call(
//       d3.drag().on("start", dragStarted).on("drag", dragged)
//       // .on("end", dragEnded)
//     );

//   /**
//    * LABELS
//    */
//   let label = svg
//     .append("g")
//     .attr("class", "labels")
//     .selectAll("text")
//     .data(data.nodes)
//     .enter()
//     .append("text")
//     .text(function (d) {
//       return d.name;
//     })
//     .attr("class", "label");
//   label
//     .style("text-anchor", "middle")
//     .style("font-size", 12)
//     .attr("fill", "white");

//   node.append("title").text((d) => `${d.name}\nValue: ${d.value}`);
//   node.attr("id", (d) => "node-" + d.name);
//   node
//     .append("text")
//     .attr("x", (d) => d.cx)
//     .attr("y", (d) => d.cy)
//     .text((d) => d.name);

//   link.on("mouseover", function (d) {
//     link.attr("opacity", 0.2);
//     d3.select(this).attr("opacity", 1);
//     linkLabel.text("Link from " + d.source.name + " to " + d.target.name);
//     linkLabel.style("visibility", "visible");
//   });

//   link.on("mousemove", function (d) {
//     var mousePos = d3.mouse(svg.node());
//     linkLabel.attr("x", mousePos[0] + 10).attr("y", mousePos[1] + 10);
//   });

//   link.on("mouseout", function (d) {
//     link.attr("opacity", 1);
//     linkLabel.style("visibility", "hidden");
//   });

//   // Tooltip
//   let toolTip = d3.select("body");

//   /**
//    * HOVER STYLE
//    */

//   // Add mouseover on the nodes
//   node.on("mouseover", function (d) {
//     // Lower opacity on all nodes
//     node.transition().attr("opacity", 0.3);
//     link.attr("opacity", 0.1);
//     // Label opacity lowered
//     label.transition().attr("opacity", 0.3);

//     // Style for active node
//     d3.select(this).transition().attr("opacity", 1);

//     // Set opacity to 1 on connected links
//     link.data().forEach((item) => {
//       if (item.source.index === d.index || item.target.index === d.index) {
//         link
//           .filter((l) => l.index == item.index)
//           .transition()
//           .attr("opacity", 1)
//           .attr("stroke-width", 2);
//       }
//     });
//   });

//   node.on("mouseout", function (d) {
//     // Reset style
//     d3.select(this).attr("fill", (n) => n.colour);
//     node.transition().attr("opacity", 1);
//     link.attr("opacity", 1);
//     label.attr("opacity", 1);
//   });

//   /**
//    * SIMULATION
//    */

//   let simulation = d3
//     .forceSimulation()
//     .force(
//       "link",
//       d3.forceLink().id((d) => d.index)
//     )
//     .force("center", d3.forceCenter(width / 2, height / 3))
//     .force("collission", d3.forceCollide().radius(50))
//     .force("charge", d3.forceManyBody().strength(-20));

//   simulation.nodes(data.nodes).on("tick", () => {
//     link
//       .attr("x1", (d) => d.source.x)
//       .attr("y1", (d) => d.source.y)
//       .attr("x2", (d) => d.target.x)
//       .attr("y2", (d) => d.target.y);

//     node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
//     label.attr("x", (d) => d.x).attr("y", (d) => d.y);
//   });

//   simulation.force("link").links(data.links);

//   let mainCharacters = getMainCharacters(data);

//   mainCharacters.forEach((character) => {
//     let label = document.createElement("label");
//     let input = document.createElement("input");

//     label.text = character.name;
//     input.type = "checkbox";
//     input.name = character.name;
//     input.value = character.name;
//     input.onclick = function (event) {
//       characterClick(event.target.name);
//     };

//     label.innerHTML = character.name;
//     label.htmlFor = character.name;

//     label.appendChild(input);
//     dropdownList.appendChild(label);
//   });

//   /**
//    * NODE DRAG FUNCTIONS
//    */
//   function dragStarted(d) {
//     if (!d3.event.active) simulation.alphaTarget(0.03).restart();
//     d.fx = d.x;
//     d.fy = d.y;
//   }

//   function dragged(d) {
//     // Check
//     d.fx = d3.event.x;
//     d.fy = d3.event.y;
//   }

//   /**
//    * MAIN CHARACTER FUNCTIONS
//    */
//   function getMainCharacters() {
//     const mainChars = data.nodes.filter((char) => char.colour !== "#808080");
//     //   let positions = mainChars.map((char) => {
//     //   });
//     return mainChars;
//   }

//   function characterClick(event) {
//     let checkedBoxes = document.querySelectorAll(
//       "input[type=checkbox]:checked"
//     );

//     let checkedNames = Array.prototype.slice
//       .call(checkedBoxes)
//       .map((box) => box.name);

//     if (checkedNames.length > 0) {
//       node.transition().attr("opacity", 0.3);
//       link.attr("opacity", 0.1);

//       checkedNames.map((char) => {
//         d3.select("#node-" + char)
//           .transition()
//           .attr("opacity", 1);
//         let d = d3.select("#node-" + char).datum();

//         link.data().forEach((item) => {
//           if (item.source.index === d.index || item.target.index === d.index) {
//             link
//               .filter((l) => l.index == item.index)
//               .transition()
//               .attr("opacity", 1)
//               .attr("stroke-width", 2);
//           }
//         });
//       });
//     } else {
//       // No names selected
//       node.transition().attr("opacity", 1);
//       link.transition().attr("opacity", 1).attr("stroke-width", 2);
//     }
//   }
//   //     }
//   //   );
// }
//   .select("#graph")
//   .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.json(
//   "./starwars-interactions/starwars-episode-1-interactions-allCharacters.json",
//   (data) => {
//     console.log(data);

//     let link = svg
//       .append("g")
//       .attr("class", "links")
//       .selectAll("line")
//       .data(data.links)
//       .enter()
//       .append("line")
//       .attr("stroke-width", 1)
//       .classed("link", true);

//     let linkLabel = svg
//       .append("text")
//       .attr("class", "link-label")
//       .style("visibility", "hidden");

//     let node = svg
//       .attr("class", "nodes")
//       .selectAll("circle")
//       .data(data.nodes)
//       .enter()
//       .append("g")
//       .append("circle")
//       .attr("r", 30)
//       .attr("fill", (d) => d.colour)
//       .classed("fixed", (d) => d.fx !== undefined)
//       .classed("nodes", true)
//       .call(
//         d3.drag().on("start", dragStarted).on("drag", dragged)
//         // .on("end", dragEnded)
//       );

//     /**
//      * LABELS
//      */
//     let label = svg
//       .append("g")
//       .attr("class", "labels")
//       .selectAll("text")
//       .data(data.nodes)
//       .enter()
//       .append("text")
//       .text(function (d) {
//         return d.name;
//       })
//       .attr("class", "label");
//     label
//       .style("text-anchor", "middle")
//       .style("font-size", 12)
//       .attr("fill", "white");

//     node.append("title").text((d) => `${d.name}\nValue: ${d.value}`);
//     node.attr("id", (d) => "node-" + d.name);
//     node
//       .append("text")
//       .attr("x", (d) => d.cx)
//       .attr("y", (d) => d.cy)
//       .text((d) => d.name);

//     link.on("mouseover", function (d) {
//       link.attr("opacity", 0.2);
//       d3.select(this).attr("opacity", 1);
//       linkLabel.text("Link from " + d.source.name + " to " + d.target.name);
//       linkLabel.style("visibility", "visible");
//     });

//     link.on("mousemove", function (d) {
//       var mousePos = d3.mouse(svg.node());
//       linkLabel.attr("x", mousePos[0] + 10).attr("y", mousePos[1] + 10);
//     });

//     link.on("mouseout", function (d) {
//       link.attr("opacity", 1);
//       linkLabel.style("visibility", "hidden");
//     });

//     // Tooltip
//     let toolTip = d3
//       .select("#tooltip-container")
//       .append("div")
//       .style("position", "absolute")
//       .style("color", "black")
//       .style("padding", "8px")
//       .style("background-color", "#626D71")
//       .style("border-radius", "6px")
//       .style("text-align", "center")
//       .style("width", "auto")
//       .text("");

//     console.log(toolTip);

//     /**
//      * HOVER STYLE
//      */

//     // Add mouseover on the nodes
//     node.on("mouseover", function (d) {
//       // Lower opacity on all nodes
//       node.transition().attr("opacity", 0.3);
//       link.attr("opacity", 0.1);
//       // Label opacity lowered
//       label.transition().attr("opacity", 0.3);

//       // Style for active node
//       d3.select(this).transition().attr("opacity", 1);

//       // Set opacity to 1 on connected links
//       link.data().forEach((item) => {
//         if (item.source.index === d.index || item.target.index === d.index) {
//           link
//             .filter((l) => l.index == item.index)
//             .transition()
//             .attr("opacity", 1)
//             .attr("stroke-width", 2);
//         }
//       });
//     });

//     node.on("mouseout", function (d) {
//       // Reset style
//       d3.select(this).attr("fill", (n) => n.colour);
//       node.transition().attr("opacity", 1);
//       link.attr("opacity", 1);
//       label.attr("opacity", 1);
//     });

//     /**
//      * SIMULATION
//      */

//     let simulation = d3
//       .forceSimulation()
//       .force(
//         "link",
//         d3.forceLink().id((d) => d.index)
//       )
//       .force("center", d3.forceCenter(width / 2, height / 3))
//       .force("collission", d3.forceCollide().radius(50))
//       .force("charge", d3.forceManyBody().strength(-20));

//     simulation.nodes(data.nodes).on("tick", () => {
//       link
//         .attr("x1", (d) => d.source.x)
//         .attr("y1", (d) => d.source.y)
//         .attr("x2", (d) => d.target.x)
//         .attr("y2", (d) => d.target.y);

//       node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
//       label.attr("x", (d) => d.x).attr("y", (d) => d.y);
//     });

//     simulation.force("link").links(data.links);

//     let mainCharacters = getMainCharacters(data);

//     mainCharacters.forEach((character) => {
//       let label = document.createElement("label");
//       let input = document.createElement("input");

//       label.text = character.name;
//       input.type = "checkbox";
//       input.name = character.name;
//       input.value = character.name;
//       input.onclick = function (event) {
//         characterClick(event.target.name);
//       };

//       label.innerHTML = character.name;
//       label.htmlFor = character.name;

//       label.appendChild(input);
//       dropdownList.appendChild(label);
//     });

//     /**
//      * NODE DRAG FUNCTIONS
//      */
//     function dragStarted(d) {
//       if (!d3.event.active) simulation.alphaTarget(0.03).restart();
//       d.fx = d.x;
//       d.fy = d.y;
//     }

//     function dragged(d) {
//       // Check
//       d.fx = d3.event.x;
//       d.fy = d3.event.y;
//     }

//     /**
//      * MAIN CHARACTER FUNCTIONS
//      */
//     function getMainCharacters() {
//       const mainChars = data.nodes.filter((char) => char.colour !== "#808080");
//       //   let positions = mainChars.map((char) => {
//       //   });
//       return mainChars;
//     }

//     function characterClick(event) {
//       let checkedBoxes = document.querySelectorAll(
//         "input[type=checkbox]:checked"
//       );

//       let checkedNames = Array.prototype.slice
//         .call(checkedBoxes)
//         .map((box) => box.name);

//       if (checkedNames.length > 0) {
//         node.transition().attr("opacity", 0.3);
//         link.attr("opacity", 0.1);

//         checkedNames.map((char) => {
//           d3.select("#node-" + char)
//             .transition()
//             .attr("opacity", 1);
//           let d = d3.select("#node-" + char).datum();

//           link.data().forEach((item) => {
//             if (
//               item.source.index === d.index ||
//               item.target.index === d.index
//             ) {
//               link
//                 .filter((l) => l.index == item.index)
//                 .transition()
//                 .attr("opacity", 1)
//                 .attr("stroke-width", 2);
//             }
//           });
//         });
//       } else {
//         // No names selected
//         node.transition().attr("opacity", 1);
//         link.transition().attr("opacity", 1).attr("stroke-width", 2);
//       }
//     }
//   }
// );

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

function createEpisodeSelect() {
  let dropdownList = document.getElementById("dropdown-list2");

  let episodes = [1, 2, 3, 4, 5, 6, 7];
  console.log(episodes);
  episodes.forEach((episode) => {
    let label = document.createElement("label");
    let input = document.createElement("input");

    input.type = "checkbox";
    input.name = episode.toString();
    input.class = "episode-checkbox";
    input.value = episode;
    input.onclick = function (event) {
      episodeClick(event.target.name);
    };

    label.innerHTML = episode.toString();
    label.htmlFor = episode.toString();

    label.appendChild(input);
    dropdownList.appendChild(label);
  });
}

function episodeClick(event) {
  let checkedBoxes = document.querySelectorAll(
    "#dropdown-list2 input[type=checkbox]:checked"
  );
  console.log(checkedBoxes);
}

// drawGraph(data);

createEpisodeSelect();

let allData = combineEpisodes();

// drawGraph(allData);

console.log(allData);

d3.json(
  "./starwars-interactions/starwars-full-interactions-allCharacters.json",
  (data) => {
    console.log("test");
    drawGraph(data);
  }
);
