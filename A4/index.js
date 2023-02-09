// Set size of window for graph and margins
let margin = { top: 10, right: 30, bottom: 30, left: 40 };
let width = 1000 - margin.left - margin.right;
let height = 1000 - margin.top - margin.bottom;

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
      .attr("stroke-width", 1);

    let node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 30)
      .attr("fill", (d) => d.colour);
    //   .call(
    //     d3
    //       .drag()
    //       .on("start", dragstarted)
    //       .on("drag", dragged)
    //       .on("end", dragended)
    //   );

    node.append("title").text((d) => d.name);

    let simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id((d) => d.index)
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    simulation.nodes(data.nodes).on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    simulation.force("link").links(data.links);
  }
);
