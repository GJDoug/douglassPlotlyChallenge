// Function for bar chart: OTU
function barChart(sample) {

    // Read .JSON data in
    d3.json("samples.json").then((data) => {
      console.log(data);  
      var samples = data.samples;

    // Filter data
      var filterSamples = samples.filter(sampleSet => sampleSet.id == sample);
      var result = filterSamples[0];
      console.log(result);

      var sample_values = result.sample_values;
      console.log(sample_values);

    // Variable for id's
      var otu_id = result.otu_ids;
      console.log(otu_id);

    // OTU and number + hover over... ugh.."$"
      var combined_labels = otu_id.map(id => `OTU ${id}`)
      var hovertext = result.otu_labels;

    // Sort sample values : low to high....   I think this is right? Seems to work.
      var sorted_values = sample_values.sort((a, b) => b - a);

    // Slice top 10 samples sorted but high to low
      var top_samples = sorted_values.slice(0,10).reverse();

    // Reverse labels
      var sorted_combined_labels = combined_labels.sort((a,b) => b - a);
      var top_labels = sorted_combined_labels.slice(0,10).reverse();


    // Bar chart:   orientation is important....
      var barTrace = {
        type: "bar",
        x: top_samples,
        y: top_labels,
        orientation: "h",
        text: hovertext
      }
      var barData = [barTrace]
    
      Plotly.newPlot("bar", barData);


    // Bubble chart: https://plotly.com/javascript/bubble-charts/
      var bubbleTrace = {
        x: otu_id,
        y: sample_values,
        text: hovertext,
        mode: "markers",
        marker: {
          color: otu_id,
          opacity: [1, 0.75, 0.5, 0.25],
          size: sample_values
        }
      };
      var dataBubble = [bubbleTrace];

    // Bubble chart layout
      var bubbleLayout = {
        xaxis: {
          title: {
            text: "OTU ID"
          }
        }
      }

      Plotly.newPlot("bubble", dataBubble, bubbleLayout);
    });
  }


function init() {
    // For dropdown text
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then(function(data) {
        console.log(data)

        // Each number in dropdown
        var dataNames = data.names;
        console.log(dataNames);

        dataNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample)
        });

        // Returns first data
        var firstData = dataNames[0];
        barChart(firstData);
        demogInfo(firstData);
        })
    }


// Function for Demographic Info box
function demogInfo(sample) {
    // Read .JSON data file in
    d3.json("samples.json").then((data) => {
        // Variable for data
        var meta = data.metadata;
        // Filter data
        var filterData = meta.filter(sampleSet => sampleSet.id == sample);
        // Get first data
        var result = filterData[0];
        // Find in .HTML
        var demoInfo = d3.select("#sample-metadata");
        // Reset demoInfo so that it wipes anything already in there
        demoInfo.html("");
        // Time suck!  Key and value pair. h6 seems right size. $..!
        Object.entries(result).forEach(([key, value]) => {
            demoInfo.append("h6").text(`${key}: ${value}`);
        });
    });
    }
    
    
// Change finder
d3.selectAll("#selDataset").on("change", optionChanged);

// Function for dropdown
function optionChanged(dropDown) {
    // Find ID = #selDataset in .HTML
    var dropList = d3.select("#selDataset");
    var dropDown = dropList.property("value");
    barChart(dropDown);
    demogInfo(dropDown);
}

init();