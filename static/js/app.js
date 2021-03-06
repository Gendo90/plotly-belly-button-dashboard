// use all_data that has loaded samples.json from load_data.js

// add the "options" elements for the select element, for each sample name in all_data
function addOptions(all_data) {
    let sample_names = all_data["names"]
    let select_element = d3.select("#selDataset")

    // console.log(sample_names)

    for (let i = 0; i < sample_names.length; i++) {
        select_element.append("option").property("value", sample_names[i]).text(sample_names[i])
    }
    console.log(all_data)
}

// add all sample names to options from the loaded sample data
addOptions(all_data);

// updates the metatable data for the sample upon selecting a new value
function updateMetaTable(val) {
    let newMetaData = all_data["metadata"].filter(a => a.id === parseInt(val))
    d3.select("#sample-metadata").html("")
    for (let [key, value] of Object.entries(newMetaData[0])) {
        d3.select("#sample-metadata").append("p").text(`${key}: ${value}`)
    }
    console.log(newMetaData[0])
}

// updates the bar chart to the new sample whenever a new sample is selected
function updateBarChart(val) {
    let newSampleData = all_data["samples"].filter(a => a.id === val)[0]
    // join together the values for each of the keys into arrays of size 3, so
    // they remain together when sorted and then are returned 
    let joinedSampleValues = [];
    // assume that there corresponding values for ids, labels, and values - that is, they are all the same length
    // for each sample name
    for (let i = 0; i < newSampleData.otu_ids.length; i++) {
        joinedSampleValues.push([newSampleData.otu_ids[i], newSampleData.otu_labels[i], newSampleData.sample_values[i]])
    }

    // sorting comparison function for use with JS built-in sort function- should return the largest 10 samples
    // as the first 10 values of the sorted joinSampleValues array
    function largestSamples(a, b) {
        return b[2]-a[2];
    }

    // sort based on sample size, largest first
    joinedSampleValues.sort(largestSamples)

    // determine if 10 values or less for sample values for this sample name
    let num_samples = (joinedSampleValues.length >= 10 ? 10 : joinedSampleValues.length);

    // split first 10 arrays into separate arrays for use with Plotly to make a bar chart
    let otu_ids = [];
    let otu_labels = [];
    let value_count = [];
    for (let i = 0; i < num_samples; i++) {
        otu_ids.push("OTU " + joinedSampleValues[i][0]);
        otu_labels.push(joinedSampleValues[i][1]);
        value_count.push(joinedSampleValues[i][2]);
    }

    // format chart data correctly for horizontal chart in Plotly
    let data = [{
        x: value_count,
        y: otu_ids,
        type: "bar", 
        text: otu_labels,
        orientation: 'h'
    }]

    //put into Plotly to make a new bar chart!
    Plotly.newPlot("bar", data)
}

// create a function to plot the bubble chart
function updateBubbleChart(val) {
    let bubbleInfo = all_data["samples"].filter(a => a.id === val)[0]

    data = [{
        x: bubbleInfo.otu_ids,
        y: bubbleInfo.sample_values,
        mode: "markers",
        marker: {
            size: bubbleInfo.sample_values, 
            color: bubbleInfo.otu_ids
        },
        text: bubbleInfo.otu_labels
    }]

    layout = {
        xaxis: {
            title: {
                text: "OTU ID"
            }
        }
    }

    Plotly.newPlot("bubble", data, layout)
}

// function to update the gauge chart given a value
function updateGaugeChart(val) {
    let bellyButtonWashes = all_data["metadata"].filter(a => a.id === parseInt(val))[0]["wfreq"]

    // assume no belly button washes if null
    bellyButtonWashes = typeof(bellyButtonWashes) === 'number' ? bellyButtonWashes : 0;

    let data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: bellyButtonWashes,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {
                    range: [0, 9],
                    tickmode: "array",
                    tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    ticktext: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            }
        }
    ];

    // text for scrubs per week depending on value of bellyButtonWashes
    let scrubTextPlural = bellyButtonWashes === 1 ? "" : "s";

    Plotly.newPlot("gauge", data, {"annotations": 
        [{
            xref: 'paper',
            yref: 'paper',
            x: 0.5,
            // xanchor: 'middle',
            y: 0.25,
            yanchor: 'top',
            text: `Scrub${scrubTextPlural} per Week`,
            showarrow: false
        }]})
}

// this function should update the plots and demographic info depending on the option's new value!
function optionChanged(val) {
    updateMetaTable(val);
    updateBarChart(val);
    updateBubbleChart(val);
    updateGaugeChart(val);
}

// initialize charts to show value for first option that can be selected
// code runs only once when this file is first added to the page and run
let firstVal = d3.select("option").property("value")
optionChanged(firstVal)