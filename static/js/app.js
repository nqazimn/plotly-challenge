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

function updateDashboardByID() {
    // Get Subject ID selected by User    
    var ID = d3.select("#selDataset").property("value");
    console.log(`${ID} was selected.`)

    d3.json(microbes_samples).then(function (data) {
        // Find index of user selected ID in data.names
        // and pass that index to data.metadata to grab demographics
        let index = data.names.indexOf(ID);
        var demographics = data.metadata[index];

        console.log(demographics);

        displayDemographics(demographics);

    });
}

// Function calls here
appendIDsToDropdown();
d3.selectAll("#selDataset").on("change", updateDashboardByID);
