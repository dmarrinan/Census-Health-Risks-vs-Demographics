var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 105, left: 125 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append an SVG group
var chart = svg.append("g");

// Append a div to the bodyj to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

var dataUrl = '/data'
d3.json(dataUrl, function (error, riskData) {
    if (error) throw error;

    console.log(riskData);

    riskData.forEach(function (data) {
        data.age = +data.age;
        data.income = +data.income;
        data.high_school_or_less = +data.high_school_or_less
        data.suffered_depression = +data.suffered_depression;
        data.obese = +data.obese;
        data.lacks_insurance = +data.lacks_insurance
    });

    // Create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);

    var xLinearScale = d3.scaleLinear().range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // These variables store the minimum and maximum values in a column in data.csv
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // This function identifies the minimum and maximum values in a column in data.csv
    // and assign them to xMin, xMax and yMax variables, which will define the axes domains
    function findMinAndMax(dataColumnX, dataColumnY) {
        xMin = d3.min(riskData, function (data) {
            return +data[dataColumnX] * 0.8;
        });

        xMax = d3.max(riskData, function (data) {
            return +data[dataColumnX] * 1.1;
        });

        yMin = d3.min(riskData, function (data) {
            return +data[dataColumnY] * 0.8;
        });

        yMax = d3.max(riskData, function (data) {
            return +data[dataColumnY] * 1.1;
        });
    }

    // The default x-axis is 'high_school_or_less'
    // The default y-axis is 'obese'
    // Another axis can be assigned to the variable during an onclick event.
    // This variable is key to the ability to change axis/data column
    var currentAxisLabelX = "high_school_or_less";
    var currentAxisLabelY = "obese";

    // Call findMinAndMax() with 'hair_length' as default
    findMinAndMax(currentAxisLabelX, currentAxisLabelY);

    // Set the domain of an axis to extend from the min to the max value of the data column
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

    // Initialize tooltip
    var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        // Define position
        .offset([80, -60])
        // The html() method allows us to mix JavaScript with HTML in the callback function
        .html(function (data) {
            var stateName = data.states;
            var demoInfo = +data[currentAxisLabelX];
            var riskInfo = +data[currentAxisLabelY];
            var demoString;
            var riskString;
            // Tooltip text depends on which axis is active/has been clicked
            if (currentAxisLabelX === "age") {
                riskString = "Median Age: ";
            }
            else if (currentAxisLabelX === "income") {
                riskString = "Median Income: ";
            }
            else if (currentAxisLabelX === "high_school_or_less") {
                riskString = "% High School: ";
            }
            if (currentAxisLabelY === "suffered_depression") {
                demoString = "% Suff Depr: ";
            }
            else if (currentAxisLabelY === "obese") {
                demoString = "% Obese: ";
            }
            else if (currentAxisLabelY === "lacks_insurance") {
                demoString = "% Lacks Ins: ";
            }
            return stateName +
                "<br>" +
                demoString +
                demoInfo +
                "<br>" +
                riskString +
                riskInfo;
        });

    // Create tooltip
    chart.call(toolTip);

    chart
        .selectAll("circle")
        .data(riskData)
        .enter()
        .append("circle")
        .attr("cx", function (data, index) {
            return xLinearScale(+data[currentAxisLabelX]);
        })
        .attr("cy", function (data, index) {
            return yLinearScale(+data[currentAxisLabelY]);
        })
        .attr("r", "15")
        .attr("fill", "#009900")
        .attr("stroke", "black")

    chart
        .selectAll("text")
        .data(riskData)
        .enter()
        .append("text")
        .attr("x", function (data, index) {
            return xLinearScale(+data[currentAxisLabelX]);
        })
        .attr("y", function (data, index) {
            return yLinearScale(+data[currentAxisLabelY]);
        })
        .attr("dy",".3em")
        .text(function (data, index) {
            return data.state_abreviations;
        })
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("class", "state-labels")
        // display tooltip on click
        .on("mouseover", function (data) {
            toolTip.show(data);
        })
        // hide tooltip on mouseout
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Append an SVG group for the x-axis, then display the x-axis
    chart
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        // The class name assigned here will be used for transition effects
        .attr("class", "x-axis")
        .call(bottomAxis);

    // Append a group for y-axis, then display it
    chart.append("g")
        .attr("class", "y-axis")
        .call(leftAxis);

    // Append y-axis label
    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text")
        // This axis label is active by default
        .attr("class", "axis-text active y-axis")
        .attr("data-axis-name", "obese")
        .text("% Obese");

    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text inactive y-axis")
        .attr("data-axis-name", "lacks_insurance")
        .text("% Lacking Insurance");

    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 65)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text inactive y-axis")
        .attr("data-axis-name", "suffered_depression")
        .text("% Have Suffered Depression");

    // Append x-axis labels
    chart
        .append("text")
        .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
        )
        // This axis label is active by default
        .attr("class", "axis-text active x-axis")
        .attr("data-axis-name", "high_school_or_less")
        .text("% Completed High School or Less");

    chart
        .append("text")
        .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
        )
        // This axis label is inactive by default
        .attr("class", "axis-text inactive x-axis")
        .attr("data-axis-name", "income")
        .text("Median Income ($)");

    chart
        .append("text")
        .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 70) + ")"
        )
        // This axis label is inactive by default
        .attr("class", "axis-text inactive x-axis")
        .attr("data-axis-name", "age")
        .text("Median Age");

    // Change an axis's status from inactive to active when clicked (if it was inactive)
    // Change the status of all active axes to inactive otherwise
    function labelChange(clickedAxis) {
        var axisToChangeFilter
        var clickedAxisName = clickedAxis.attr("data-axis-name")
        if (clickedAxisName === 'high_school_or_less' || clickedAxisName === 'income' || clickedAxisName === 'age') {
            axisToChangeFilter = '.x-axis'
        }
        else {
            axisToChangeFilter = '.y-axis'
        }
        console.log(axisToChangeFilter)
        d3
            .selectAll(".axis-text")
            .filter(".active")
            .filter(axisToChangeFilter)
            // An alternative to .attr("class", <className>) method. Used to toggle classes.
            .classed("active", false)
            .classed("inactive", true);

        clickedAxis.classed("inactive", false).classed("active", true);
    }

    d3.selectAll(".axis-text").on("click", function () {
        // Assign a variable to current axis
        var clickedSelection = d3.select(this);
        // "true" or "false" based on whether the axis is currently selected
        var isClickedSelectionInactive = clickedSelection.classed("inactive");
        // console.log("this axis is inactive", isClickedSelectionInactive)
        // Grab the data-attribute of the axis and assign it to a variable
        // e.g. if data-axisName is "poverty," var clickedAxis = "poverty"
        var clickedAxis = clickedSelection.attr("data-axis-name");
        console.log("current axis: ", clickedAxis);

        // The onclick events below take place only if the x-axis is inactive
        // Clicking on an already active axis will therefore do nothing
        if (isClickedSelectionInactive) {
            if (clickedAxis === 'high_school_or_less' || clickedAxis === 'income' || clickedAxis === 'age') {
                // Assign the clicked axis to the variable currentAxisLabelX
                currentAxisLabelX = clickedAxis;
                // Call findMinAndMax() to define the min and max domain values.
                findMinAndMax(currentAxisLabelX, currentAxisLabelY);
                // Set the domain for the x-axis
                xLinearScale.domain([xMin, xMax]);
                // Create a transition effect for the x-axis
                svg
                    .select(".x-axis")
                    .transition()
                    // .ease(d3.easeElastic)
                    .duration(1800)
                    .call(bottomAxis);
                // Select all circles to create a transition effect, then relocate its horizontal location
                // based on the new axis that was selected/clicked
                d3.selectAll("circle").each(function () {
                    d3
                        .select(this)
                        .transition()
                        // .ease(d3.easeBounce)
                        .attr("cx", function (data) {
                            return xLinearScale(+data[currentAxisLabelX]);
                        })
                        .duration(1800);
                });

                d3.selectAll(".state-labels").each(function () {
                    d3
                        .select(this)
                        .transition()
                        .attr("x", function (data) {
                            return xLinearScale(+data[currentAxisLabelX]);
                        })
                        .duration(1800);
                });

                // Change the status of the axes. See above for more info on this function.
                labelChange(clickedSelection);
            }
            else {
                // Assign the clicked axis to the variable currentAxisLabelX
                currentAxisLabelY = clickedAxis;
                // Call findMinAndMax() to define the min and max domain values.
                findMinAndMax(currentAxisLabelX, currentAxisLabelY);
                // Set the domain for the x-axis
                yLinearScale.domain([yMin, yMax]);
                // Create a transition effect for the x-axis
                svg
                    .select(".y-axis")
                    .transition()
                    // .ease(d3.easeElastic)
                    .duration(1800)
                    .call(leftAxis);
                // Select all circles to create a transition effect, then relocate its horizontal location
                // based on the new axis that was selected/clicked
                d3.selectAll("circle").each(function () {
                    d3
                        .select(this)
                        .transition()
                        // .ease(d3.easeBounce)
                        .attr("cy", function (data) {
                            return yLinearScale(+data[currentAxisLabelY]);
                        })
                        .duration(1800);
                });
                d3.selectAll(".state-labels").each(function () {
                    d3
                        .select(this)
                        .transition()
                        .attr("y", function (data) {
                            return yLinearScale(+data[currentAxisLabelY]);
                        })
                        .duration(1800);
                });


                // Change the status of the axes. See above for more info on this function.
                labelChange(clickedSelection);
            }
        }
    });
});