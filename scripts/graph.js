const waveColours = ["#238636", '#38a6ff', '#ff7846', '#4c32a8']
const FREQUENCY_GRAPH_OFFSET = 30
const WAVE_SCALING_FACTOR = 0.8
const DATA_WAVE_SCALING_FACTOR = 80

let noise_thresold = 0;

function drawAxes(ctx, drawLower=true) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    var xMin = 0;
    
    ctx.beginPath();
    ctx.strokeStyle = "rgb(128,128,128)";

    let gradient = ctx.createLinearGradient(width/2, 0, width/2, height);
    if (drawLower) {
        gradient.addColorStop(0, "rgb(128,128,128,0)");
        gradient.addColorStop(0.05, "rgb(128,128,128,0)");
        gradient.addColorStop(0.15, "rgb(128,128,128,255)");
        gradient.addColorStop(0.8, "rgb(128,128,128,255)");
        gradient.addColorStop(0.95, "rgb(128,128,128,0)");
        gradient.addColorStop(1, "rgb(128,128,128,0)");
    } else {
        gradient.addColorStop(0, "rgb(128,128,128,0)");
        gradient.addColorStop(0.1, "rgb(128,128,128,0)");
        gradient.addColorStop(0.3, "rgb(128,128,128,255)");
        gradient.addColorStop(0.8, "rgb(128,128,128,255)");
    }

    ctx.strokeStyle = gradient;
    // Y-Axis
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();

    ctx.beginPath();
    
    // X-Axis
    if (drawLower) {
        ctx.moveTo(xMin, height/2);
        ctx.lineTo(width, height/2);
    } else {
        ctx.moveTo(xMin, height);
        ctx.lineTo(width, height);
    }
    ctx.stroke();
}

function drawOffsetAxes(ctx) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    var xMin = 0;
    
    ctx.beginPath();
    ctx.strokeStyle = "rgb(128,128,128)";
    
    // X-Axis
    ctx.moveTo(xMin, height-FREQUENCY_GRAPH_OFFSET);
    ctx.lineTo(width, height-FREQUENCY_GRAPH_OFFSET);
    
    // Y-Axis
    ctx.moveTo(FREQUENCY_GRAPH_OFFSET, 0);
    ctx.lineTo(FREQUENCY_GRAPH_OFFSET, height);
    
    ctx.stroke();
}

function plotFunction(ctx, wave, colour) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    ctx.lineWidth = 3;
    
    var y = 0;
    ctx.beginPath();

    if (colour != null) {
        ctx.strokeStyle = colour;
    }

    for (let x = -width/2; x < width/2; x++) {

        y = - wave.getPositionAtTime(x, width)*WAVE_SCALING_FACTOR;

        ctx.lineTo(x+(width/2), y + (height/2));
    }

    ctx.stroke();
    ctx.save();

}

function plotDataWave(ctx, wave, codingScheme) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    ctx.lineWidth = 3;
    
    var y = 0;
    ctx.beginPath();

    let prevDataPoint = 0;
    let dataPoint = 0;
    for (let x = 0; x <= width; x++) {

        dataPoint = wave.getPositionAtTime(x, codingScheme)
        y = dataPoint*DATA_WAVE_SCALING_FACTOR;
        // This allows us to make the vertical lines straight
        if (dataPoint != prevDataPoint){
            ctx.lineTo(x-1,-y+height-10);
        } else {
            ctx.lineTo(x,-y+height-10);
        }

        prevDataPoint = wave.getPositionAtTime(x, codingScheme);
    }

    ctx.stroke();
    ctx.save();
}

function plotEyeDiagram(ctx, wave) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    ctx.lineWidth = 3;
    
    var y = 0;
    ctx.beginPath();

    let dataPoint = 0;
    for (let x = dataWave.timePeriod; x <= width; x = x + dataWave.timePeriod) {

        for (let j = 0; j <= dataWave.timePeriod*2; j++) {

            dataPoint = wave.getPositionAtTime(x+(j-dataWave.timePeriod/2), 'inverseFourier')
            y = dataPoint*DATA_WAVE_SCALING_FACTOR;
    
            if (j == 0) {
                ctx.moveTo((j),-y+height-10);
            } else {
                ctx.lineTo((j),-y+height-10);
            }
            
        }
    }

    ctx.stroke();
    ctx.save();
}

let displayAllTimePeriods = false;
let showMarkings = true;
function updateGraph(graph) {
    graph.canvas.width = window.innerWidth;
    graph.canvas.height = window.innerHeight/8;


    var context = graph.canvas.getContext("2d");

    context.clearRect(0, 0, graph.canvas.width, graph.canvas.height);
    context.save();

    context.beginPath();
    context.strokeStyle = "rgb(128,128,128)";

    if (graph.codingScheme == 'eyeDiagram') {
        plotEyeDiagram(context, dataWave);
    } else {
        plotDataWave(context, dataWave, graph.codingScheme);
    }
    

    if ((graph.canvas.displayTimePeriod || displayAllTimePeriods) && showMarkings) {
        displayTimePeriod(graph.canvas);
    }

    context.restore();
}

let codingSchemes = [null, "rtz", "manchester", "nrzm", "bipolar"]

graphs = [{
    canvas: document.getElementById('canvas'),
    codingScheme: null
},
{
    canvas: document.getElementById('codingCanvas'),
    codingScheme: "nrzm"
},
/*{
    canvas: document.getElementById('fourierCanvas'),
    codingScheme: "fourier"
},*/
{
    canvas: document.getElementById('inverseFourierCanvas'),
    codingScheme: "inverseFourier"
},
{
    canvas: document.getElementById('eyeDiagramCanvas'),
    codingScheme: "eyeDiagram"
},]

function updateGraphs() {

    if (dataWave.needsRefresh && dataWave.initialised) {
        dataWave.generateCodingData();
    }

    if (dataWave.needsInverseFourierRefresh && dataWave.fourierInitalised) {
        dataWave.generateInverseFourierData();
    }

    graphs.forEach(graph => {
        updateGraph(graph);
    })

    window.requestAnimationFrame(updateGraphs);
    position += 0.03;
}


function displayTimePeriod(canvas) {
    let ctx = canvas.getContext("2d");

    var height = ctx.canvas.height;

    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.strokeStyle = "#38a6ffaa";

    let i;
    for (i=1; i<dataWave.data.length; i++) {
        ctx.moveTo(i*dataWave.timePeriod-1, height-DATA_WAVE_SCALING_FACTOR-10);
        ctx.lineTo(i*dataWave.timePeriod-1, height-10);
    }
    ctx.stroke();
    ctx.save();
}

function onClickGraph(event) {
    // Find which time segment is being targeted
    let timeSegment = Math.floor(event.clientX / dataWave.timePeriod);

    let i;

    dataWave.data[timeSegment] = !dataWave.data[timeSegment];

    dataWave.needsRefresh = true;

    updateProbability();
}

let roundedProbability = 0.5;
function updateProbability() {
    let probabilitySlider = document.getElementById('dataWaveProbability');
    let probabilityLabel = document.getElementById('p1Label');

    let probability1 = dataWave.calculateProbabilityOf1()
    let probability1Rounded = Math.round( probability1 * 100 + Number.EPSILON ) / 100;

    roundedProbability = probability1Rounded;

    probabilitySlider.value = probability1Rounded;
    probabilityLabel.innerText = String.raw`\[P(1) = ${probability1Rounded}\]`;
    MathJax.typeset();
    updateEntropy();
}

function updateEntropy() {

    let probability1 = roundedProbability;
    let probability0 = 1 - probability1
    let H = 0;
    if (probability1 != 0 && probability1 != 1) {
        H = probability0 * Math.log2(1/probability0) + probability1 * Math.log2(1/probability1);
    }
    let HRounded = H.toFixed(2)
    document.getElementById('EntropyLabel').innerText = String.raw`\[ H = ${HRounded} = \sum_{i=0}^{m-1} = P(A_i) \cdot \log_2 \frac{1}{P(A_i)}\]`;
    MathJax.typeset();
}

let dataWave;
let position = 0;

function init() {

    dataWave = new DataWave(105);

    graphs.forEach(graph => graph.canvas.addEventListener("mousedown", onClickGraph));

    window.requestAnimationFrame(updateGraphs);


}