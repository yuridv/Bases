console.log(`[BackEnd]=> Starting...`)
require('dotenv-safe').config();
const express = require("express");
const routes = require('./src/Routes/routes')

express()
  .use(express.json())

  .get('*', routes)
  .post('*', routes)
  .put('*', routes)
  .delete('*', routes)

  .listen(process.env.PORT || 3000, function (err) {
    if (err) return console.log(`[BackEnd]=> Error Loading:\n${err}`)
    console.log(`[BackEnd]=> Successfully Loaded!`)
  });