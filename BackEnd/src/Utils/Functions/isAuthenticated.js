const Errors = require('./Errors')
const { db } = require('../moldes')
const jwt = require("jsonwebtoken");

const route = (req, pool) => new Promise(async (res,rej) => {
  try {
    if (db.authenticate.ignore.find(r=> r == req.params[0]+'/'+req.method)) return res({})
    req.headers["authorization"] = (req.headers["authorization"] || '').replace('Bearer ','')
    if (!req.headers["authorization"]) return rej({ error: `O token não foi informado...` })

    let token = jwt.verify(req.headers["authorization"], process.env.CRYPTOGRAPHY_KEY, (err, token) => {
      if (err) return { status: 401, error: `O token inserido é invalido...` }
      return token;
    })
    if (token.error) return rej(token);

    let login = await pool.request().query(`
      SELECT * FROM logins WHERE [token] = '${req.headers["authorization"]}' AND [expire] >= GETDATE()
    `).then(r=> r.recordset.map(r=> { return { ...r, expire: new Date(r.expire).getHours() - 3 } })[0])
    if (!login) return rej({ status: 401, error: `O seu token é invalido ou expirou! Faça login novamente...` });
    return res(login);
  } catch(err) {
    return Errors(err, `AUTHENTICATED ${__dirname}`)
      .then(() => { return route(req) })
      .catch((e) => rej(e))
  }
})

module.exports = route;