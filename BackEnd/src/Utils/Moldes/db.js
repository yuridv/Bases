module.exports = {
  mssql: {},
  authenticate: {
    ignore: [
      "/login/post"
    ]
  },
  whatsapp: {
    sessions: {},
    messages: {
      queue: []
    }
  },
  socket: {
    sessions: {}
  }
}