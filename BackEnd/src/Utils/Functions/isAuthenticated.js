const Errors = require('./Errors')
const { DB } = require('../moldes')
const jwt = require("jsonwebtoken");

const route = (req, pool) => new Promise(async (res,rej) => {
  try {
    if (DB.authenticate.ignore.find(r=> r == req.params[0]+'/'+req.method)) return res({})
    req.headers["authorization"] = (req.headers["authorization"] || '').split(" ")[1]
    if (!req.headers["authorization"]) return rej({ error: `O token não foi informado...` })

    let token = jwt.verify(req.headers["authorization"], process.env.CRYPTOGRAPHY_KEY, (err, token) => {
      if (err) return { status: 401, error: `O token inserido é invalido...` }
      return token;
    })
    if (token.error) return token;

    let user = await pool.request().query(`
      SELECT * FROM logins WHERE [token] = '${req.headers["authorization"]}' AND [expire] >= GETDATE()
    `).then(r=> r.recordset.map(r=> { return { ...r, expire: new Date(r.expire).getHours() - 3 } })[0])
    if (!user) return rej({ status: 401, error: `O seu token é invalido ou expirou! Faça login novamente...` });
    return res(user);
  } catch(err) {
    return Errors(err, `AUTHENTICATED ${__dirname}`)
      .then(() => { return route(req) })
      .catch((e) => rej(e))
  }
})

module.exports = route;