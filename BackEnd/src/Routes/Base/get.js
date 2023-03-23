const get = (req, res) => {
  try {
    return { status: 200 }
  } catch(err) {
    console.log(err)
    console.log(`[ROUTE /base/get] => ${err}`)
    return { status: 500, error: 'Ocorreu algum erro na minha API! Reporte aos Desenvolvedores...' }
  }
}

module.exports = get