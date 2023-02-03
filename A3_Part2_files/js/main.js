/**
 *
    Author: Kahin Akram
    Date: Jan 24, 2020
    TNM048 Lab 1 - Visual Information-Seeking Mantra
    Main js file
 *
*/
//Passing data to the function
var world_map, focus_plus_context, points
d3.json("./data/ethqk.geojson", function (data) {

    //Plotting
    points = new Points();
    //Working with the map
    world_map = new worldMap(data);
    //Working with the focus+context
    focus_plus_context = new focusPlusContext(data);

})
