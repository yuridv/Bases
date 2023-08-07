const WhatsApp = require('../../../Controllers/WhatsApp')
const { Errors } = require('../../../Utils/functions')
const { db } = require('../../../Utils/moldes')

const route = async (req, res, login, pool) => {
  try {
    let sessions = db.whatsapp.sessions
    if (!sessions[login.user]) return { status: 409, error: `Você não está com o WhatsApp aberto...` }
    if (!sessions[login.user].browser)  return { status: 409, error: `Você já está com o WhatsApp desconectado...` }

    if (!await sessions[login.user].isConnected()) return { status: 409, error: `Você já não está conectado ao WhatsApp...` }

    let disconnect = await sessions[login.user].Disconnect();
    if (disconnect.error) return disconnect;

    await sessions[login.user].Close();

    return { status: 200 };
  } catch(err) {
    return Errors(err, `ROUTE ${__dirname}/${req.method}`)
      .then(() => { return route(req, res) })
      .catch((e) => e)
  }
}

module.exports = route