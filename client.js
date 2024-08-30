const net = require('net');
const readline = require('readline');

const client = new net.Socket();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//'127.0.0.1' (localhost) alana '10.3.134.193' murilo 45677, '10.3.134.90'
client.connect(3000, '127.0.0.1', () => {
    console.log('Conectado ao servidor.');
});

client.on('data', (data) => {
    console.log(data.toString().trim());
});

client.on('close', () => {
    console.log('Conexão fechada.');
});

rl.on('line', (input) => {
    client.write(input);
});
