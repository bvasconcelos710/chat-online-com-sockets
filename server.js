const net = require('net');

const clients = {}; // Mapeia socket.remotePort para nickname

const server = net.createServer((socket) => {
    console.log(`Novo cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data', (data) => {
        const message = data.toString().trim();

        // Primeira mensagem deve ser o nickname
        if (!clients[socket.remotePort]) {
            if (!message.startsWith('!nick')) {
                socket.write('Você deve enviar um nickname ao entrar.\n');
                socket.end();
                return;
            } else {
                const nickname = message.split(' ')[1];
                clients[socket.remotePort] = { nickname, socket };

                // Envia lista de usuários conectados ao novo cliente
                const userList = Object.values(clients).map(client => client.nickname).join(' ');
                socket.write(`!users ${Object.keys(clients).length} ${userList}\n`);

                // Notifica todos os outros clientes que um novo usuário entrou
                broadcast(`!msg ${nickname} entrou no chat.`, socket);
                return;
            }
        }

        // Processa comandos após o nickname estar definido
        if (message.startsWith('!sendmsg ')) {
            const text = message.substring('!sendmsg'.length);
            broadcast(`! msg ${clients[socket.remotePort].nickname} ${text}`, socket);
            socket.write(`! msg ${clients[socket.remotePort].nickname} ${text}`);
        } else if (message.startsWith('!changenickname')) {
            const newNickname = message.split('!changenickname')[1];
            const oldNickname = clients[socket.remotePort].nickname;
            clients[socket.remotePort].nickname = newNickname;
            broadcast(`!changenickname ${oldNickname} para ${newNickname}`, socket);
            socket.write(`!nickname alterado para ${newNickname}`);
        } else if (message.startsWith('!poke')) {
            const targetNickname = message.split('!poke')[1];
            pokeUser(targetNickname, clients[socket.remotePort].nickname);
        } else {
            socket.write('Comando desconhecido.\n');
        }
    });

    socket.on('end', () => {
        const nickname = clients[socket.remotePort]?.nickname;
        if (nickname) {
            delete clients[socket.remotePort];
            broadcast(`!left ${nickname} saiu do chat.`, socket);
        }
    });

    socket.on('error', (err) => {
        console.error(`Erro no cliente ${socket.remoteAddress}:${socket.remotePort}: ${err.message}`);
    });
});

function broadcast(message, senderSocket) {
    Object.values(clients).forEach(client => {
        if (client.socket !== senderSocket) {
            client.socket.write(message + '\n');
        }
    });
}

function pokeUser(targetNickname, pokerNickname) {
    const targetClient = Object.values(clients).find(client => client.nickname === targetNickname);
    if (targetClient) {
        targetClient.socket.write(`!poke ${pokerNickname} poked ${targetNickname}\n`);
    } else {
        clients[socket.remotePort].socket.write(`Usuário ${targetNickname} não encontrado.\n`);
    }
}

server.listen(3000, () => {
    console.log('Servidor escutando na porta 3000');
});
