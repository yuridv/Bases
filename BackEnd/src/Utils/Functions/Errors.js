const route = (err, menu) => new Promise(async (res,rej) => {
  menu = menu.replace(process.cwd(), '').replace('\\src','').replaceAll('\\','/')
  if (err.error) {
    return rej({ error: err.error })
  } else {
    console.log(err)
    console.log(`[${menu}]=> Ocorreu algum ERRO na minha API...`)
    return rej({ error: `[${menu}]=> Ocorreu algum erro em nossa API! Tente novamente mais tarde...` })
  }
})

module.exports = route