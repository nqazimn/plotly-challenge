const microbes_samples = "../../../samples.json"

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

function plotOTUs(OTUdata) {
    console.log(OTUdata.sample_values.slice(0, 11));
    console.log(OTUdata.otu_ids.slice(0, 11));
    console.log(OTUdata.otu_labels.slice(0, 11));

    var xValues = OTUdata.sample_values.slice(0, 11);
    var yValues = OTUdata.otu_ids.slice(0, 11);
    var bacteriaLabels = OTUdata.otu_labels.slice(0, 11);

    var sumOfxValues = xValues.reduce(function (a, b) {
        return a + b;
    }, 0);

    var percentageOfxValues = xValues.map(function (item) {
        return parseFloat((item / sumOfxValues).toFixed(2));
    });

    var yValuesModified = yValues.map(function (item) {
        return `OTU ${+item}  `;
    })

    var labels = bacteriaLabels.map(function (item) {
        return item.replace(/;/g, "<br>")
    })

    console.log(percentageOfxValues);

    var trace = {
        x: percentageOfxValues,
        y: yValuesModified,
        data: xValues,
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
        },
        xaxis: {
            tickformat: ',.0%',
            range: [0, 1],
            side: "top"
        }
    };

    var data = [trace];

    Plotly.newPlot("bar", data, layout)
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
        plotOTUs(OTUdata);

    });
}

// Function calls here
appendIDsToDropdown();
d3.selectAll("#selDataset").on("change", updateDashboardByID);
