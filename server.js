const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = [];

wss.on("connection", (ws) => {
  console.log("Новое соединение");

  ws.send(JSON.stringify({ type: "history", data: messages }));

  ws.on("message", (message) => {
    const messageData = JSON.parse(message);
    const { data: text } = messageData;

    console.log(`Получено сообщение: ${text}`);

    messages.push(messageData);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "message", data: text }));
      }
    });
  });

  ws.on("close", () => console.log("Соединение закрыто"));
});

app.use(express.static("public"));

server.listen(3000, "0.0.0.0", () => {
  console.log("Сервер запущен на порту 3000");
});
