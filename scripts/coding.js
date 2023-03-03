
/**
 * Takes in a wave and returns the Return To Zero Coding of the wave.
 * When a 1 data point is encountered the wave will remain at 1 then return to 0
 * @param {DataWave} wave 
 */
function returnToZero(wave) {
    let i;
    let returnToZeroData = new Array(wave.data.length*2).fill(false);

    for (i=0; i < wave.data.length; i++) {
        if (wave.data[i]) {
            returnToZeroData[i*2] = true;
            returnToZeroData[i*2+1] = false;
        }
    }
    return returnToZeroData;
}

/**
 * Takes in a wave and returns the Mancher Coding of the wave
 * This follows the IEEE 802.3 ethernet standards where a logic high is a low- high signal sequence and a logic low is a high- low signal sequence
 * @param {DataWave} wave 
 */
function manchester(wave) {
    let manchesterData = new Array(wave.data.length).fill(0);

    for (i=0; i < wave.data.length; i++) {
        if (wave.data[i]) {
            manchesterData[i*2] = true;
            manchesterData[i*2+1] = false;
        } else {
            manchesterData[i*2] = false;
            manchesterData[i*2+1] = true;
        }
    }
    return manchesterData;
}

/**
 * Takes in a wave and returns the NRZ - M Coding of the wave
 * A logic high forces a transistion and a logic low keeps the signal the same
 * @param {DataWave} wave 
 */
function nrzm(wave) {
    let nrzmData = new Array(wave.data.length).fill(false);

    let i;

    nrzmData[0] = wave.data[0]

    for (i=1; i < wave.data.length; i++) {
        if (wave.data[i]) {
            if (nrzmData[i-1]) {
                nrzmData[i] = false;
            } else {
                nrzmData[i] = true;
            }
        } else {
            let oldData = nrzmData[i-1];
            nrzmData[i] = oldData;
        }
    }
    return nrzmData;

}

/**
 * Takes in a wave and returns the Bipolar Coding of the wave
 * A logic high forces an alternating high- zero/ low-zero transisition and a logic low sets the signal to zero
 * @param {DataWave} wave 
 */
function bipolar(wave) {
    let bipolarData = new Array(wave.data.length).fill(0);

    let alternator = true;

    for (i=0; i < wave.data.length; i++) {
        if (wave.data[i]) {
            if (alternator) {
                bipolarData[i] = 1;
            } else {
                bipolarData[i] = 0;
            }
            alternator = !alternator;
        } else {
            bipolarData[i] = 0.5;
        }
    }
    return bipolarData;
}

/**
 * Takes in a wave and returns the MLT-3 Coding of the wave
 * Moves between -1 0 +1 0 on every high bit and remains constant on a zero bit
 * @param {DataWave} wave 
 */
function mlt3(wave) {
    let mltData = new Array(wave.data.length).fill(0);

    let pattern = [0, 0.5, 1, 0.5];
    let currentPatternPosition = 0;

    for (i=0; i < wave.data.length; i++) {
        if (wave.data[i]) {
            mltData[i] = pattern[Math.floor(currentPatternPosition%4)];
            currentPatternPosition += 1;
        } else {
            mltData[i] = pattern[Math.floor(currentPatternPosition%4)];
        }
    }
    return mltData;
}

function changeLineCoding(codingScheme, self) {

    let menuItems = document.getElementsByClassName('codingMenu');

    for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.add('notSelected');
    }
    self.classList.remove('notSelected');

    dataWave.setCodingScheme( codingScheme);
    dataWave.needsRefresh = true;
}