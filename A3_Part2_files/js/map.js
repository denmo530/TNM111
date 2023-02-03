/**
 *
    Author: Kahin Akram
    Date: Jan 24, 2020
    TNM048 Lab 1 - Visual Information-Seeking Mantra
    Leaflet map file
 *
*/
function worldMap(data) {

    /**
     * Task 14 - Create a leaflet map and put center to 10,15 with zoom scale of 1
     */

    /**
     * Task 15 - Get the tileLayer from the link at the bottom of this file
     * and add it to the map created above.
    */

    /**
     * Task 16 - Create an svg call on top of the leaflet map.
     * Also append a g tag on this svg tag and add class leaflet-zoom-hide.
     * This g tag will be needed later.
     */

    /**
     * Task 17 - Create a function that projects lat/lng points on the map.
     * Use latLngToLayerPoint, remember which goes where.
     */

    /**
     * Task 18 - Now we need to transform all to the specific projection
     * create a variable called transform and use d3.geoTransform with the function above a parameter
     * {point:function.}
     * Create another variable names d3geoPath to project this transformation to it.
     */
    //Transforming to the specific projection

    // similar to projectPoint this function converts lat/long to
    //svg coordinates except that it accepts a point from our
    //GeoJSON
    function applyLatLngToLayer(d) {
        var x = d.geometry.coordinates[0];
        var y = d.geometry.coordinates[1];
        //Remove comment when reached task 19
        return leaflet_map.latLngToLayerPoint(new L.LatLng(y, x));
    }

    //<---------------------------------------------------------------------------------------------------->

    /**
     * Task 19 - Plot the dots on the map
     * Create a variable and name it feature.
     * select all circle from g tag and use data.features.
     * Also add a class called mapcircle and set opacity to 0.4
     */
    //features for the points

    /**
     * Task 20 - Call the plot function with feature variable
     * not integers needed.
     */

    //Redraw the dots each time we interact with the map
    //Remove comment tags when done with task 20
    //leaflet_map.on("moveend", reset);
    //reset();

    //Mouseover
    //Remove comment tags when done with task 20
    //mouseOver(feature);
    //mouseOut(feature);

    //Mouse over function
    function mouseOver(feature){

        feature
            .on("mouseover", function (d) {
                selection = d3.select(this)
                    .attr('r', 15)
                //Update the tooltip position and value
                points.tooltip(d);

                //Uncomment if implemented
                //focus_plus_context.hovered();

            });
    }

    //Mouse out function
    function mouseOut(feature){

        feature
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", function (d) {
                        if (d.properties.DEATHS == null) {
                            return 3;
                        }
                        else {
                            return scaleQuantRad(d.properties.DEATHS);
                        }
                    });

            });
    }

    // Recalculating bounds for redrawing points each time map changes
    function reset() {
        var bounds = d3path.bounds(data)
        topLeft = [bounds[0][0] + 10, bounds[0][1] - 10]
        bottomRight = [bounds[1][0] + 10, bounds[1][1] + 10];

        // Setting the size and location of the overall SVG container
        svg_map
            .attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g.attr("transform", "translate(" + (-topLeft[0]) + "," + (-topLeft[1]) + ")");

        feature.attr("transform",
            function (d) {
                return "translate(" +
                    applyLatLngToLayer(d).x + "," +
                    applyLatLngToLayer(d).y + ")";
            });
    }

    //<---------------------------------------------------------------------------------------------------->

    /**
     * Update the dots on the map after brushing
     */
    this.change_map_points = function (curr_view_erth) {

        map_points_change = d3.selectAll(".mapcircle")
            .filter(function (d) { return curr_view_erth.indexOf(d.id) != -1; })
            .attr('r', 7)
            .transition()
            .duration(800);

        //Call plot funtion.
        points.plot(map_points_change)

        d3.selectAll(".mapcircle")
            .filter(function (d) { return curr_view_erth.indexOf(d.id) == -1; })
            .transition()
            .duration(800)
            .attr('r', 0)
    }

    //<---------------------------------------------------------------------------------------------------->

    /**
     * Function for hovering the points, implement if time allows.
     */
    this.hovered = function (input_point) {
        console.log("If time allows you, implement something here!");
    }

    //<---------------------------------------------------------------------------------------------------->

    //Link to get the leaflet map
    function map_link() {
        return "https://api.mapbox.com/styles/v1/josecoto/civ8gwgk3000a2ipdgnsscnai/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9zZWNvdG8iLCJhIjoiY2l2OGZxZWNuMDAxODJ6cGdhcGFuN2IyaCJ9.7szLs0lc_2EjX6g21HI_Kg";
    }

}
