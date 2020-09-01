// use all_data that has loaded samples.json from load_data.js

// add the "options" elements for the select element, for each sample name in all_data
function addOptions(all_data) {
    let sample_names = all_data["names"]
    let select_element = d3.select("#selDataset")

    // console.log(sample_names)

    for (let i = 0; i < sample_names.length; i++) {
        select_element.append("option").property("value", sample_names[i]).text(sample_names[i])
    }
}

// add all sample names to options from the loaded sample data
addOptions(all_data);


function updateMetaTable(val) {
    let newMetaData = all_data["metadata"].filter(a => a.id === parseInt(val))
    d3.select("#sample-metadata").html("")
    for (let [key, value] of Object.entries(newMetaData[0])) {
        d3.select("#sample-metadata").append("p").text(`${key}: ${value}`)
    }
    console.log(newMetaData[0])
}

// this function should update the plots and demographic info depending on the option's new value!
function optionChanged(val) {
    updateMetaTable(val);
}
