init();
// On change to the DOM, call optionChanged()
d3.selectAll("#selDataset").on("change", optionChanged);

function init() 
{
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        var samples = data.names;
        samples.forEach((sample) => {
            selector.append("option")
            .text(sample)
            .property("value",sample);
        });
        //set drop down menu initial sample to the first sample in the array
        var firstSample = samples[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}
//function called by DOM changes
function optionChanged(newSample)
{
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var newSample = dropdownMenu.property("value"); 
    buildCharts(newSample);
    buildMetadata(newSample);
}
function buildCharts(sample) 
{
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        //keep only sample array object that matches argument sample '940'
        var sampleArray = samples.filter(sampleObj => sampleObj.id == sample );
        var result = sampleArray[0];
        var otu_ids = result.otu_ids;
        var sample_values = result.sample_values;
        var otu_labels = result.otu_labels;
        // Convert ids into strings, to put only the values that have x-data
        // categorize the data. 
        // When you put in numeric data, it puts it on a number line on the y-axis 
        // and doesn't fill in the gaps where there are no "ids" with data.  
        // Categorical data is exclusive for only the data present
        yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    
        var barData = [
        {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: 'h'
        }];
        var barLayout = {
            //title: "Top 10 OTUs Found",
            margin: {t:0, l: 150}
        };

        Plotly.newPlot("bar", barData, barLayout);

        var bubbleData = [
        {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values
            }
        }];
        var bubbleLayout = {
            //title: "Cultured Bacteria",
            margin: {t: 0},
            hovermode: "closes",
            xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

//Display the sample metadata, 
//i.e., an individual's demographic information
function buildMetadata(sample) 
{
    d3.json("samples.json"). then((data) => {
        var metadata = data.metadata;    
        var metadataArray = metadata.filter(metadataObj => metadataObj.id == sample);
        result = metadataArray[0];
        var panel = d3.select("#sample-metadata");
        //clear the panel body div
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });     
    });
}


