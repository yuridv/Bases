const { Errors } = require('../../Utils/functions')
const jwt = require("jsonwebtoken");

const route = async (req, res, pool) => {
  try {
    if (!req.body.user || !req.body.password) return { status: 400, error: `O usuário ou senha não foi informado...` }

    let sql = await pool.request().query(`
      SELECT * FROM logins WHERE [user] = '${req.body.user}' AND [password] = '${req.body.password}'
    `).then(r=> r.recordset[0])
    if (!sql || !sql.user) return { status: 401, error: `O usuário ou senha são invalidos...` }
    
    let token = jwt.sign({ user: req.body.user, password: req.body.password }, process.env.CRYPTOGRAPHY_KEY)
  
    let date = new Date()
    date.setHours(date.getHours() + 9);
    await pool.request().query(`
      UPDATE logins SET [token] = '${token}', [expire] = '${date.toISOString().replace('T',' ').replace('Z','')}' WHERE [user] = '${req.body.user}'
    `)
    return { token }
  } catch(err) {
    return Errors(err, `ROUTE ${__dirname}/${req.method}`)
      .then(() => { return route(req, res) })
      .catch((e) => e)
  }
}

module.exports = route