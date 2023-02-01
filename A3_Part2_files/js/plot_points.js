/**
 *
    Author: Kahin Akram
    Date: Jan 24, 2020
    TNM048 Lab 1 - Visual Information-Seeking Mantra
    Plotting the points file
 *
*/

//Defining scales for radius of points and the colors.
//Colors chosen from Color Brewer Palette

var scaleQuantRad = d3.scaleQuantile()
    .domain([0, 4, 12, 102, 316000])
    .range([3, 4, 5, 6]);

var scaleQuantColor = d3.scaleQuantile()
    .domain([0, 3, 11, 101, 316000])
    .range(["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f"]);

function Points() {

    //Function for plotting the points
    this.plot = function(selection, rescale_null = 1, rescale_val = 1) {
        //plot the points
        selection
        //Task add fnctionallity for radius and fill it
            .attr('r', function (d) {
                if (d.properties.DEATHS === null) {
                    return 3 / rescale_null;
                } else {
                    return scaleQuantRad(d.properties.DEATHS) / rescale_val;
                }
            })
            .attr('fill', function (d) {
                if (d.properties.DEATHS === null) {
                    return "#4d4d4d";
                } else {
                    return scaleQuantColor(d.properties.DEATHS);
                }
            })
    }

    this.tooltip = function(d) {
        //Helper function for including information tool_tip
        // Defining tooltip for hovering points
        var tooltip = d3.select("#tooltip")
        tooltip
            .select("#magnitude")
            .text("Magnitude: " + d.properties.EQ_PRIMARY)

        tooltip
            .select("#date")
            .text("Date: " + d.properties.Date)

        if (d.properties.DEATHS == null) {
            tooltip
                .select("#deaths")
                .text("Deaths: No entry")
        } else {
            tooltip
                .select("#deaths")
                .text("Deaths: " + d.properties.DEATHS)
        }

        if (d.properties.NAME === null) {
            tooltip
                .select("#country")
                .text("Country: No entry")
        } else {
            tooltip
                .select("#country")
                .text("Country: " + d.properties.NAME)
        }
    }

}
