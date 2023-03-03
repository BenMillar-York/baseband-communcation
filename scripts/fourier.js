
/**
 * Computes the DFT of array of real values
 * @param {Array} data - An array of Y Coordinates.
 * @returns {Array} freqArray, an array of Complex numbers
 */
function discreteFourierTransform(data) {
    console.log('Calc Fourier')
    // Computes the Fourier Transform in O(N^2) rather than O(N logN)
    const numDataPoints = data.length;
    let freqArray = Array(data.length).fill(0);

    for (let frequency = 0; frequency < numDataPoints; frequency++) {

        let frequencySignal = new Complex(0, 0);

        for (let n = 0; n < numDataPoints; n++) {

            let amplitude = data[n];

            let exponent = -2 * pi * frequency * (n/numDataPoints);

            /* As cos x = Re (e^jx)
                & sin x = Im (e^jx)*/
            let contribution = new Complex(amplitude * Math.cos(exponent), amplitude * Math.sin(exponent));

            frequencySignal = addComplex(frequencySignal, contribution);

        }
        frequencySignal = frequencySignal.divide(numDataPoints);

        freqArray[frequency] = frequencySignal;
    }
    return freqArray;
}


/**
 * Computes the IDFT of array of Complex numbers
 * @param {Array} freqArray - An array of Complex Numbers
 * @returns {Array} timeArray, an array of Complex numbers
 */
function inverseFourierTransform(freqArray) {
    const N = freqArray.length;
    let timeArray = Array(N).fill(0);
  
    for (let k = 0; k < N; k++) {

        let timeSignal = new Complex(0, 0);

        for (let n = 0; n < N; n++) {

            let amplitude = freqArray[n];
            let exponent = new Complex(Math.cos(2 * pi * k * (n/N)), Math.sin(2 * pi * k * (n/N)));

            /* As cos x = Re (e^jx)
            & sin x = Im (e^jx)*/
            let contribution = amplitude.multiply(exponent);

            timeSignal = addComplex(timeSignal, contribution)
        }
        timeArray[k] = timeSignal.divide(N);
    }
  
    return timeArray;
}

function sampleData(data, samplesPerBit) {
    let sampleData = [];
    for (let i = 0; i< data.length; i++) {
        for (let j = 0; j < samplesPerBit; j++) {
            sampleData.push(data[i]);
        }
    }
    return sampleData;
}
    