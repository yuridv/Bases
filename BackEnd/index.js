console.log(`[BackEnd]=> Starting...`)
require('dotenv-safe').config();
const routes = require('./src/Routes/routes')
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app
  .use(express.json())

  .get('*', routes)
  .post('*', routes)
  .put('*', routes)
  .delete('*', routes)

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(process.env.PORT || 3000, async (err) => {
  if (err) return console.log(`[BackEnd]=> Error Loading:\n${err}`)
  console.log(`[BackEnd]=> Successfully Loaded!`)
});