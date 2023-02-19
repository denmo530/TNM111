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
      filterEpisodeData(event.target.name);
    };

    label.innerHTML = episode.toString();
    label.htmlFor = episode.toString();

    label.appendChild(input);
    dropdownList.appendChild(label);
  });
}

function filterEpisodeData(event) {
  let checkedBoxes = document.querySelectorAll(
    "#dropdown-list2 input[type=checkbox]:checked"
  );
  let filteredData = [];

  // Add data from episode that corresponds to checkboxes
  checkedBoxes.forEach((box) => filteredData.push(allData[box.value - 1]));

  let nodes = filteredData.map((item) => item.nodes);
  let links = filteredData.map((item) => item.links);

  let uniqueNodes = [];
  nodes.flat().reduce((arr, curr) => {
    if (uniqueNodes.some((node) => node.name === curr.name)) {
      uniqueNodes.find((node) => node.name === curr.name).value += curr.value;
    } else {
      uniqueNodes.push(curr);
    }
  }, {});

  let combinedData = { nodes: uniqueNodes, links: links.flat() };
  console.log(combinedData);

  return combinedData;
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
