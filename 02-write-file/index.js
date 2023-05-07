const fs = require('fs');
const path = require('path');
const readline = require('readline');

const file = path.join(__dirname, 'text.txt');
fs.writeFile(file, '', err => {
    if (err) throw err;
    console.log('Введите текст:');
});

const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function close() {
    console.log('До свидания!');
    process.exit();
}

readLine.on('line', (input) => {
    if (input === 'exit') {
        close();
    } else {
        fs.appendFile(file, input + '\n', (err) => {
            if (err) throw err;
        });
    }
});

readLine.on('SIGINT', () => {
    close();
});

