'use strict';
const readlineSync = require('readline-sync');

function randomNum(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

let amount = randomNum(3, 6);

let number;
if (amount == 3) {
    number = randomNum(100, 999);
}
else if (amount == 4) {
    number = randomNum(1000, 9999);
}
else if (amount == 5) {
    number = randomNum(10000, 99999);
}
else if (amount == 6) {
    number = randomNum(100000, 999999);
}

let numberStr = number.toString();
let numberLength = numberStr.length;

console.log(amount);
console.log(number);

let userNumber;

do {
    userNumber = readlineSync.question(`Enter a ${numberLength}-digit number\n`);

    let coincidence = [];
    let mismatch = [];

    for (let i = 0; i < numberLength ; i++) {
        if(numberStr[i] == userNumber[i]) {
            coincidence.push(numberStr[i])
        }
        else if(numberStr.includes(userNumber[i])){
            mismatch.push(userNumber[i])
        }
    }

    console.log(`Цифр на своих местах - ${coincidence.length} (${coincidence.join(', ')}).
Cовпавших цифр не на своих местах - ${mismatch.length} (${mismatch.join(', ')})`);

} while (number.toString() != userNumber);
