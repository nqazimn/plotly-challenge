const microbes_samples = "../../../samples.json"

function appendIDsToDropdown() {
    d3.json(microbes_samples).then(function (data) {

        console.log(data);

        var patientIDs = Object.values(data.names);

        var select = d3.select("select");

        patientIDs.forEach(ID => {
            var ID_option = select.append("option");

            ID_option.text(ID);
        });
    });
}

appendIDsToDropdown();