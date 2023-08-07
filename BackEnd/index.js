console.log(`[BackEnd]=> Starting...`)
require('dotenv-safe').config();
const routes = require('./src/Routes/routes')
const { isAuthenticated, MSSQL } = require('./src/Utils/functions')
const { db } = require('./src/Utils/moldes')
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

io.on('connection', async (socket) => {
  if (!socket.handshake || !socket.handshake.auth || !socket.handshake.auth.token || !socket.handshake.query) return;
  let pool = await MSSQL();
  if (pool.error) return;
  return isAuthenticated({ headers: { authorization: socket.handshake.auth.token }, body: socket.handshake.query, params: [] }, pool)
    .then(async (login) => {
      console.log(`[${login.user}]=> Conectado!`)
      db.socket.sessions[login.user] = socket
      socket.on('disconnect', () => { 
        db.socket.sessions[login.user] = false;
        console.log(`[${login.user}]=> Desconectado!`) 
      });
    })
    .catch((e) => {});
});

server.listen(process.env.PORT || 3000, async (err) => {
  if (err) return console.log(`[BackEnd]=> Error Loading:\n${err}`)
  console.log(`[BackEnd]=> Successfully Loaded!`)
});