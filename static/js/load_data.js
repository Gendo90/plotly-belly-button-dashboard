// load data before running app.js

// first, get the JSON file with all the data, and store in a variable
// and then run app.js after data has loaded
let all_data;
fetch("./samples.json").then(a => a.json()).then(a => all_data = a)
.then(
    function() {
        d3.select("body").append("script").property("src", "./static/js/app.js")
    }
)

// samples.json info now stored in all_data variable!
// app.js should run after data has been loaded into all_data variable!