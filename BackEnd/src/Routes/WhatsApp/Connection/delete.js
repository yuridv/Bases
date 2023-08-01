const { Errors } = require('../../../Utils/functions')
const { DB } = require('../../../Utils/moldes')
const WhatsApp = require('../../../Browsers/WhatsApp')

const route = async (req, res, login, pool) => {
  try {
    let sessions = DB.whatsapp.sessions
    if (!sessions[login.user]) return { status: 409, error: `Você não está com o WhatsApp aberto...` }
    if (!sessions[login.user].browser)  return { status: 409, error: `Você já está com o WhatsApp desconectado...` }

    if (!await sessions[login.user].isConnected()) return { status: 409, error: `Você já não está conectado ao WhatsApp...` }

    await sessions[login.user].Close();

    return { status: 200 };
  } catch(err) {
    return Errors(err, `ROUTE ${__dirname}/${req.method}`)
      .then(() => { return route(req, res) })
      .catch((e) => e)
  }
}

module.exports = route