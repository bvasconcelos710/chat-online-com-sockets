## Projeto de um chat com socket desenvolvido com Node.js para a disciplina de Sistemas Distribuidos.

Este projeto implementa um chat simples via socket usando Node.js e o módulo net, que é nativo do node.
O sistema é composto por dois programas principais: um servidor (server.js) e um cliente (client.js).

## Para executar

- Clone o repositório:
````bash
git clone https://github.com/bvasconcelos710/chat-online-com-sockets.git
````

- Execute o servidor:
````bash
node server.js
````

- Execute o cliente:
````bash
node client.js
````

## Utilize os comandos disponíveis no chat

- Definir Nickname: A primeira mensagem enviada pelo cliente deve definir o nickname:
````bash
!nick SEU_NICKNAME
````

- Enviar Mensagem: Para enviar uma mensagem ao chat:
````bash
!sendmsg SUA_MENSAGEM
````

- Trocar de Nickname: Para alterar seu nickname durante a sessão:
````bash
!changenickname NOVO_NICKNAME
````

- Cutucar Outro Usuário: Para cutucar um outro usuário:
````bash
!poke NICKNAME_DO_USUARIO
````
