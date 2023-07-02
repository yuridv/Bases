const express = require('express')

express()
  .use(express.static(__dirname + '/html'))

  .get('*', async function(req, res) {
    res.sendFile(__dirname + '/html/index.html')
  })

  .listen(process.env.PORT || 80, function (err) {
    if (err) return console.log(`[Bancos]=> Error Loading:\n${err}`)
    console.log(`[Bancos]=> Successfully Loaded!`)
  });