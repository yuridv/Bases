console.log(`[FrontEnd]=> Starting...`)
const express = require('express')
const fs = require('fs')

express()
  .use(express.static(__dirname + '/html'))

  .get('*', async function(req, res) {
    if (req.params[0].includes('.html') && !fs.existsSync(__dirname + `/html/views${req.params[0]}`)) return res.status(400).send()
    res.sendFile(__dirname + '/html/index.html')
  })

  .listen(process.env.PORT || 80, function (err) {
    if (err) return console.log(`[FrontEnd]=> Error Loading:\n${err}`)
    console.log(`[FrontEnd]=> Successfully Loaded!`)
  });