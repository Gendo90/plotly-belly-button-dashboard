//use all_data that has loaded samples.json from load_data.js

//add the "options" elements for the select element, for each sample name in all_data
function addOptions(all_data) {
    let sample_names = all_data["names"]
    let select_element = d3.select("#selDataset")

    // console.log(sample_names)

    for (let i = 0; i < sample_names.length; i++) {
        select_element.append("option").property("value", sample_names[i]).text(sample_names[i])
    }
}

addOptions(all_data)
