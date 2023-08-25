const { Errors } = require('../../Utils/functions')

const route = async (req, res, login, pool) => {
  try {
    if (!req.body.user || !req.body.password) return { status: 400, error: `O usuário ou senha não foi informado...` }

    let sql = await pool.request().query(`
      SELECT * FROM logins WHERE [token] = '${req.headers["authorization"]} AND [expire] >= GETDATE()'
    `).then(r=> r.recordset[0])
    if (!sql || !sql.user) return { status: 401, error: `O seu login expirou ou é invalido...` }
    
    return { token }
  } catch(err) {
    return Errors(err, `ROUTE ${__dirname}/${req.method}`)
      .then(() => { return route(req, res) })
      .catch((e) => e)
  }
}

module.exports = route