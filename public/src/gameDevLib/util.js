/**
 * Calculates a random hex value
 */
export function randomHexValChar() {
    let hex = Math.round(Math.random() * 15);
    let hexChar = hex.toString(16);
    return hexChar;
}

/**
 * Generates a string of random hex values of length @keyLength
 */
export function generateHexKey(keyLength = 20) {
    let key = "";
    for (let i = 0; i < keyLength; i++) {
        key += randomHexValChar();
    }
    return key;
}