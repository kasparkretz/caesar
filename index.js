var germanWords = require("all-the-german-words");

function countGermanWords(str) {
    const substrings = germanWords.filter((w) => w.length > 2 && str.indexOf(w.toLowerCase()) > 0);
    return substrings.length;
}

function prompt(question) {
    return new Promise((resolve, reject) => {
        const { stdin, stdout } = process;

        stdin.resume();
        stdout.write(question);

        stdin.on('data', data => resolve(data.toString().trim()));
        stdin.on('error', err => reject(err));
    });
}

const menu = `Kaspar's Caesar-Verschlüsselungsprogramm
******************************************
Was willst Du tun?

1. Einen Text verschlüsseln?
2. Einen Text entschlüsseln?
3. Einen verschlüsselten Text knacken?
`

const cleartext = `
Gib einen Klartext ein:
`
const ciphertext = `
Gib einen Geheimtext ein:
`
const key = `
Gib eine Verschiebungszahl ein:
`
const choices = {};

const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890äöü?!+-*/ ';

function encrypt(cleartext, key) {
    var ciphertext = '';
    var alphabetindex, ciphertextindex;
    for (var i = 0; i < cleartext.length; i++) {
        alphabetindex = alphabet.indexOf(cleartext[i]);
        if (alphabetindex < 0) {
            throw "Der Buchstabe " + cleartext[i] + " ist nicht Teil des Alphabets!"
        }
        ciphertextindex = (alphabetindex + key) % alphabet.length;
        ciphertext += alphabet[ciphertextindex];
    }
    return ciphertext;
}

function decrypt(ciphertext, key) {
    var cleartext = '';
    var alphabetindex, cleartextindex, shift;
    for (var i = 0; i < ciphertext.length; i++) {
        alphabetindex = alphabet.indexOf(ciphertext[i]);
        if (alphabetindex < 0) {
            throw "Der Buchstabe " + ciphertext[i] + " ist nicht Teil des Alphabets!"
        }
        shift = Math.abs(alphabet.length - key);
        cleartextindex = (alphabetindex + shift) % alphabet.length;
        cleartext += alphabet[cleartextindex];
    }
    return cleartext;
}

function attack(ciphertext) {
    var candidateText;
    var wordCounts = [];
    var maxWords = 0;
    var germanWordCount;
    for (i = 0; i < alphabet.length; i++) {
        candidateText = decrypt(ciphertext,i);
        germanWordCount = countGermanWords(candidateText);
        if (germanWordCount > maxWords) {
            maxWords = germanWordCount;
        }
        wordCounts.push(germanWordCount);
    }
    return decrypt(ciphertext,wordCounts.indexOf(maxWords));
}

prompt(menu)
    .then((mainAction) => {
        choices.main = mainAction;
        switch (choices.main) {
            case '1':
                return prompt(cleartext);
                break;
            case '2':
                return prompt(ciphertext);
                break;
            case '3':
                return prompt(ciphertext);
                break;
        }
    })
    .then((secondaryAction) => {
        switch (choices.main) {
            case '1':
                choices.cleartext = secondaryAction;
                return prompt(key);
                break;
            case '2':
                choices.ciphertext = secondaryAction;
                return prompt(key);
                break;
            case '3':
                choices.ciphertext = secondaryAction;
                process.stdout.write(attack(choices.ciphertext));
                process.exit();
                break;
        }
        process.exit();
    })
    .then((ternaryAction) => {
        switch (choices.main) {
            case '1':
                choices.key = ternaryAction;
                process.stdout.write(encrypt(choices.cleartext, parseInt(choices.key)));
                process.exit();
                break;
            case '2':
                choices.key = ternaryAction;
                process.stdout.write(decrypt(choices.ciphertext, parseInt(choices.key)));
                process.exit();
                break;
        }
        process.exit();
    })
    .catch((error) => {
        console.log("Es is ein Fehler aufgetreten!");
        console.log(error);
        process.exit();
    })

