const { Errors } = require('../Utils/functions')
const Browser = require('../Browsers/WhatsApp')

const route = async () => {
  try {
        
  } catch(err) {
    return Errors(err, `CONTROLLER ${__dirname}`)
      .then(r => { return route(req, res, DB) })
      .catch(r => { return { status: r.status || 500, ...r } })
  }
}

module.exports = route