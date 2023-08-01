const { Errors } = require('../../Utils/functions')

const route = async (req, res, login, pool) => {
  try {

  } catch(err) {
    return Errors(err, `ROUTE ${__dirname}/${req.method}`)
      .then(() => { return route(req, res) })
      .catch((e) => e)
  }
}

module.exports = route