const pi = Math.PI;
const SAMPLES_PER_BIT = 100;

function ceiling(value){
    if (value < 0){
        return 0;
    }
    if (value > 1){
        return 1;
    }
    return Math.ceil(value)
}

class Wave {
    constructor(amplitude, frequency, phase, colour) {
        this.amplitude = amplitude;
        this.frequency = frequency; // Hz
        this.phase = phase; // Radians
        this.colour = colour;
    }

    getPositionAtTime(time) {
        return 1;
    }
}

class SineWave extends Wave {
    constructor(amplitude, frequency, phase, velocity, colour){
        super(amplitude, frequency, phase, colour);
        this.amplitude = amplitude;
        this.frequency = frequency; // Hz
        this.phase = phase; // Radians
        this.velocity = velocity;
    }

    getPositionAtTime(time){
        let amplitude = this.amplitude;
        let omega = 2*Math.PI*this.frequency;
        let phase = this.phase;
        return  amplitude * Math.cos(omega*time-(position*this.velocity)-phase);
    }
}

class SquareWave extends Wave {
    constructor(amplitude, frequency, phase, velocity, colour){
        super(amplitude, frequency, phase, colour);
        this.amplitude = amplitude;
        this.frequency = frequency; // Hz
        this.phase = phase; // Radians
        this.velocity = velocity;
    }

    getPositionAtTime(time) {
        let amplitude = this.amplitude;
        let omega = 2*Math.PI*this.frequency;
        let phase = this.phase;
        return amplitude * ceiling(Math.cos(omega*time-(position*this.velocity)-phase));
    }
}

class DataWave {
    constructor(timePeriod) {
        this.timePeriod = timePeriod;
        this.probability1 = 0.5;
        this.data = [];
        this.codedData = [];
        this.codingScheme = nrzm;
        this.currentCodingSchemeData = this.nrzmData;
        this.needsRefresh = true;
        this.initialised = false;
        this.fourierInitalised = false;
        this.frequencyThreshold = 50;
        this.needsInverseFourierRefresh = false;
        this.generateData();
    }

    generateDataOld() {
        let dataPoint = 0;
        let i;
        dataPoint = Math.random() < roundedProbability;

        for (i = 0; i < this.timePeriod; i++) {
            this.data.push(dataPoint == true)
        }

        this.generateCodingData();
    }
    
    generateData() {
        let dataPoint = 0;

        let dataLength = this.data.length;

        let nextPowerOf2 = 64;

        if (dataLength != 0) {
            nextPowerOf2 = 2 ** (Math.ceil(Math.log2(dataLength))+1);
        }
        
        console.log(dataLength, nextPowerOf2)

        for (let i = dataLength; i < nextPowerOf2; i++) {
            dataPoint = Math.random() < roundedProbability;
            this.data.push(dataPoint);
        }

        this.generateCodingData();
    }


    generateCodingData() {
        this.codedData = this.codingScheme(this);
        
        if (this.fourierInitalised) {
            this.generateFourierData();
        }

        this.needsRefresh = false;
        this.initialised = true;
    }

    generateFourierData() {
        this.fourierData = discreteFourierTransform(sampleData(this.codedData, SAMPLES_PER_BIT));
        this.generateInverseFourierData()
    }

    generateInverseFourierData() {
        let data = [];
        // Make a shallow copy of the array so we do not alter the original array
        this.fourierData.forEach( dataPoint => { data.push(dataPoint); })
        for (let i = this.frequencyThreshold; i < data.length - this.frequencyThreshold; i++) {
            data[i] = new Complex(0, 0);
        }
        this.inverseFourierData = inverseFourierTransform(data);
        this.demodulatedSignal = this.demodulateSignal(this.inverseFourierData, null);

        this.fourierInitalised = true;
        this.needsInverseFourierRefresh = false;
    }

    /*regenerateDataWithNewTimePeriod(newTimePeriod) {
        let resampleData = [];
        let i, j;
        for (i = 0; i < this.data.length && i < window.innerWidth; i = i + this.timePeriod) {
            for (j = 0; j < newTimePeriod; j++) {
                resampleData.push(this.data[i])
            }
        }
        this.data = resampleData;
        this.timePeriod = newTimePeriod;
        this.needsRefresh = true;
    }*/

    recreateData() {
        this.data = [];
    }

    getPositionAtTime(time, coding=null) {
        if (!this.initialised) { return null; }
        if ((coding == 'fourier' || coding == 'inverseFourier') && this.fourierInitalised == false) { this.generateFourierData(); } 
        if (Math.ceil(time / this.timePeriod) >= this.data.length) {
            //this.generateData();
        }

        if (coding == null) { return this.data[Math.floor(time / this.timePeriod)];}
        if (coding == 'demodulated') { return this.demodulatedSignal[Math.floor(time / this.timePeriod)];}
        if (coding == 'fourier') { 

            let data = [];
            // Make a shallow copy of the array so we do not alter the original array
            this.fourierData.forEach( dataPoint => { data.push(dataPoint); })

            for (let i = this.frequencyThreshold; i < data.length - this.frequencyThreshold; i++) {
                data[i] = new Complex(0,0);
            }

            let point = Math.log10(data[time].magnitude)/10+0.8;
            return point;
        }  
        if (coding == 'inverseFourier') { 
            let samplesPerBit = this.inverseFourierData.length / this.data.length;
            let index = Math.floor(time /  this.timePeriod * samplesPerBit);
            return this.inverseFourierData[index+1];
        }   
        return this.codedData[Math.floor(time / (this.timePeriod / (this.codedData.length / this.data.length)))];
        
    }

    calculateProbabilityOf1 () {
        let total = 0;
        let i;

        for (i = 0; i < dataWave.data.length; i++) {
            if (dataWave.data[i]) {
                total++;
            }
        }
        return total / dataWave.data.length
    }

    setCodingScheme(codingFunction) {
        this.codingScheme = codingFunction;
    }

    demodulateSignal(data, codingFunction) {
        let plotPoints = []
        let demodulatedSignal = []
        for (let i = this.timePeriod/2; i < data.length; i = i + this.timePeriod) {
            plotPoints.push(i);
            let samplesPerBit = SAMPLES_PER_BIT;
            let index = Math.floor(i /  this.timePeriod * samplesPerBit);
            let signal = data[index+1];
            demodulatedSignal.push(signal > 0.5);
        }
        this.plotPoints = plotPoints;
        return demodulatedSignal;
    }
    
}

class SumWave {
    constructor(waves) {
        this.waves = waves; 
    }

    getPositionAtTime(time) {
        let sum = 0;
        this.waves.forEach(wave => {
            sum += wave.getPositionAtTime(time);
        });
        return sum;
    }
}

function updateProbabilitySlider(value) {
    dataWave.probability1 = value;
    probabilityLabel = document.getElementById('p1Label');
    probabilityLabel.innerText = String.raw`\[P(1) = ${value}\]`;
    MathJax.typeset();
    dataWave.recreateData();
}