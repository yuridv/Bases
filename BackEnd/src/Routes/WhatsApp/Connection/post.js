const { Errors } = require('../../../Utils/functions')
const { DB } = require('../../../Utils/moldes')
const WhatsApp = require('../../../Browsers/WhatsApp')

const route = async (req, res, login, pool) => {
  try {
    let sessions = DB.whatsapp.sessions
    if (!sessions[login.user]) sessions[login.user] = new WhatsApp()
    if (!sessions[login.user].browser) await sessions[login.user].Browser()

    if (await sessions[login.user].isConnected()) return { status: 409, error: `A sua sessão já está conectada no WhatsApp...` }

    await sessions[login.user].Page('https://web.whatsapp.com')

    return { status: 200 }
  } catch(err) {
    return Errors(err, `ROUTE ${__dirname}/${req.method}`)
      .then(() => { return route(req, res) })
      .catch((e) => e)
  }
}

module.exports = route