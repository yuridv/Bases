const { Errors } = require('../../../Utils/functions')
const { db } = require('../../../Utils/moldes')

const route = async (req, res, login, pool) => {
  try {

    if (!req.body.phone) return { status: 400, error: `O campo "phone" não foi preenchido...` }
    if (!req.body.message) return { status: 400, error: `O campo "message" não foi preenchido...` }

    req.body.message = encodeURIComponent(req.body.message);
    req.body.phone = req.body.phone.replaceAll(' ','').replaceAll('(','').replaceAll(')','').replaceAll('-','').replaceAll('+','')
    if (!Number(req.body.phone)) return { status: 400, error: `O telefone preenchido contem caracteres invalidos! Exemplo: +55 (51) 9 1234-5678` }
    if (req.body.phone.length != 13) return { status: 400, error: `O telefone preenchido é invalido! Exemplo: +55 (51) 9 1234-5678` }

    let session = db.whatsapp.sessions[login.user]
    if (!session) return { status: 409, error: `Você não iniciou a sessão com o WhatsApp...` }
    if (!session.browser) return { status: 409, error: `Você não está com a sessão WhatsApp aberta...` }

    if (!await session.isConnected()) return { status: 409, error: `Você não está conectado ao seu WhatsApp...` }

    session.queue[session.queue.length] = {
      author: login.user,
      phone: req.body.phone,
      message: req.body.message,
      date: new Date()
    }

    return { status: 201, message: 'A mensagem foi adicionada na fila para ser enviada...' }
  } catch(err) {
    return Errors(err, `ROUTE ${__dirname}/${req.method}`)
      .then(() => { return route(req, res) })
      .catch((e) => e)
  }
}

module.exports = route