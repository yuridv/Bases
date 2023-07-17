const rota = (err, menu) => new Promise(async(res,rej) => {
  if (err.error) {
    return rej({ error: err.error })
  } else {
    console.log(err)
    console.log(`[${menu}]=> ${err}`)
    return rej({ error: `[${menu}]=> Ocorreu algum erro na minha API! Reporte ao Yuri...` })
  }
})

module.exports = rota