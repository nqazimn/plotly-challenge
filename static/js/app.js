const microbes_samples = "samples.json"

function appendIDsToDropdown() {
    d3.json(microbes_samples).then(function (data) {

        console.log(data);

        var subjectIDs = Object.values(data.names);
        var selectTag = d3.select("select");

        subjectIDs.forEach(ID => {
            var optionTag = selectTag.append("option");
            optionTag.text(ID);
        });
    });
}

function capitalizeFirstLetter(string) {
    // source:shorturl.at/ctyS8
    return string.replace(/^./, string[0].toUpperCase());
}

function displayDemographics(demographics) {

    var table = d3.select("#sample-metadata").
        select("table");

    table.html("");

    // // Append table headers
    Object.entries(demographics).forEach(function ([key, value]) {
        var row = table.append("tr");

        // Prettify visualization
        switch (key) {
            case "id":
                row.append("th").text(key.toUpperCase());
                row.append("td").text(value);
                break;
            case "age":
                row.append("th").text("Age");
                row.append("td").text(value + " years");
                break;
            case "bbtype":
                row.append("th").text("Type of Belly Button");
                row.append("td").text(value);
                break;
            case "wfreq":
                row.append("th").text("Washing Frequency");
                row.append("td").text(value + " (per week)");
                break;
            default:
                row.append("th").text(capitalizeFirstLetter(key));
                row.append("td").text(value);
                break;
        }
    });
}

function prettifyOTULabels(item) {
    // Replaces ";" with new0line character in a given string to increase readability
    return item.replace(/;/g, "<br>");
}

function prettifyAxisLabels(item) {
    // Adds string OTU before otu_label from the data to increase readability
    return `OTU ${+item}`;
}

function calcPercentage(array) {
    var sumOfArray = array.reduce(function (a, b) {
        return a + b;
    }, 0);

    var percentage = array.map(function (item) {
        return parseFloat((item / sumOfArray).toFixed(2));
    });

    return percentage;
}

function createBarChart(OTUdata) {
    console.log(OTUdata.sample_values.slice(0, 11));
    console.log(OTUdata.otu_ids.slice(0, 11));
    console.log(OTUdata.otu_labels.slice(0, 11));

    var xValues = OTUdata.sample_values.slice(0, 11);
    var yValues = OTUdata.otu_ids.slice(0, 11);
    var OTULabels = OTUdata.otu_labels.slice(0, 11);

    var percentageOfxValues = calcPercentage(xValues);

    var yValuesModified = yValues.map(prettifyAxisLabels);

    var labels = OTULabels.map(prettifyOTULabels);

    var trace = {
        x: percentageOfxValues,
        y: yValuesModified,
        type: "bar",
        orientation: "h",
        name: "OTU",
        text: labels,
        marker: {
            color: 'rgba(50,171,96,0.6)',
            line: {
                color: 'rgba(50,171,96,1.0)',
                width: 0
            }
        },
        hovertemplate:
            "Percentage: %{x}<br><br>" +
            "%{text}" +
            "<extra></extra>"
    }

    var layout = {
        title: "Percentage of OTUs",
        yaxis: {
            autorange: "reversed",
            ticks: "outside",
            ticklen: 10,
            tickcolor: "white",
            linecolor: 'gray',
            linewidth: 0.01,
            mirror: true
        },
        xaxis: {
            tickformat: ',.0%',
            range: [0, 1],
            side: "top",
            tickmode: "linear",
            tick0: 0,
            dtick: 0.25,
            border: 1,
            linecolor: 'gray',
            linewidth: 0.5,
            mirror: true
        }
    };

    var data = [trace];

    Plotly.newPlot("bar", data, layout);
}

function createBubbleChart(OTUdata) {
    var xValues = OTUdata.otu_ids;
    var yValues = OTUdata.sample_values;
    var OTULabels = OTUdata.otu_labels;

    var percentageOfyValues = calcPercentage(yValues);

    var trace = {
        x: xValues,
        y: yValues,
        text: OTULabels.map(prettifyOTULabels),
        type: "scatter",
        mode: "markers",
        marker: {
            size: yValues,
            sizeref: 0.05,
            sizemode: "area",
        },
        transforms: [{
            type: "groupby",
            groups: xValues
        }],
        hovertemplate:
            "Count: %{y}<br><br>" +
            "%{text}" +
            "<extra></extra>"
    }

    var layout = {
        title: "Breakdown of OTUs in Belly Button",
        yaxis: {
            ticks: "outside",
            ticklen: 5,
            tickcolor: "white",
            title: "Count of OTU",

        },
        xaxis: {
            title: "OTU ID"
        },
        showlegend: false
    };

    var data = [trace];

    Plotly.newPlot('bubble', data, layout);

}

function createGauge(demographics) {
    var washingFrequency = Math.round(demographics.wfreq);

    console.log(demographics.wfreq);

    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseInt(washingFrequency),
            title: { text: "Washing Frequency <br>(scrubs per week)" },
            type: "indicator",
            mode: "gauge+number",
            text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
            textinfo: "text",
            textposition: "inside",
            // delta: { reference: 1 },
            gauge: {
                axis: { range: [0, 9] },
                steps: [
                    { range: [8, 9], color: 'rgb(128,181,134)' },
                    { range: [7, 8], color: 'rgb(133,188,139)' },
                    { range: [6, 7], color: 'rgb(135,192,128)' },
                    { range: [5, 6], color: 'rgb(183,205,139)', },
                    { range: [4, 5], color: 'rgb(213,229,149)' },
                    { range: [3, 4], color: 'rgb(229,233,177)' },
                    { range: [2, 3], color: 'rgb(233,231,201)' },
                    { range: [1, 2], color: 'rgb(243,240,229)' },
                    { range: [0, 1], color: 'rgb(247,242,236)' }

                ],
                threshold: {
                    line: { color: "red", width: 3 },
                    thickness: 0.75,
                    value: parseInt(washingFrequency)
                }
            }
        }
    ];

    var layout = {
        width: 600,
        height: 450,
        margin: { t: 0, b: 0 },
    };
    Plotly.newPlot('gauge', data, layout);
}

function initializeDashboard() {

    d3.json(microbes_samples).then(function (data) {
        // Initialize by the first ID available in the data
        var ID = data.names[0];
        // Find index of user selected ID in data.names
        // and pass that index to data.metadata to grab demographics
        let index = data.names.indexOf(ID);
        var demographics = data.metadata[index];
        var OTUdata = data.samples[index];

        console.log(demographics);
        console.log(OTUdata);

        displayDemographics(demographics);
        createBarChart(OTUdata);
        createGauge(demographics);
        createBubbleChart(OTUdata);

    });
}

function updateDashboardByID() {
    // Get Subject ID selected by User    
    var ID = d3.select("#selDataset").property("value");
    console.log(`${ID} was selected.`)

    d3.json(microbes_samples).then(function (data) {
        // Find index of user selected ID in data.names
        // and pass that index to data.metadata to grab demographics
        let index = data.names.indexOf(ID);
        var demographics = data.metadata[index];
        var OTUdata = data.samples[index];

        console.log(demographics);
        console.log(OTUdata);

        displayDemographics(demographics);
        createBarChart(OTUdata);
        createGauge(demographics);
        createBubbleChart(OTUdata);

    });
}

// Function calls here
appendIDsToDropdown();
initializeDashboard();
d3.selectAll("#selDataset").on("change", updateDashboardByID);
