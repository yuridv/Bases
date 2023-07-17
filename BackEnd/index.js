console.log(`[BackEnd]=> Starting...`)
const express = require("express");
let routes = require('./src/Routes/routes')

express()
  .use(express.json())

  .get('*', (req, res) => routes(req, res, 'get'))
  .post('*', (req, res) => routes(req, res, 'post'))
  .put('*', (req, res) => routes(req, res, 'put'))
  .delete('*', (req, res) => routes(req, res, 'delete'))

  .listen(process.env.PORT || 3000, function (err) {
    if (err) return console.log(`[BackEnd]=> Error Loading:\n${err}`)
    console.log(`[BackEnd]=> Successfully Loaded!`)
  });