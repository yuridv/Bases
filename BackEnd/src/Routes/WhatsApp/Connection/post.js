const WhatsApp = require('../../../Controllers/WhatsApp')
const { Errors } = require('../../../Utils/functions')
const { db } = require('../../../Utils/moldes')

const route = async (req, res, login, pool) => {
  try {
    let sessions = db.whatsapp.sessions
    if (!sessions[login.user]) sessions[login.user] = new WhatsApp(login.user)
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