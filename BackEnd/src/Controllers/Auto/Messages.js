const { Timeout, Errors } = require('../../Utils/functions');
const { db } = require('../../Utils/moldes');

const Controller = async () => {
  try {

      let sessions = Object.values(db.whatsapp.sessions).filter(r=> r.queue && r.queue.length > 0 && r.isConnected())
      for (let session of sessions) {
        for (let queue of session.queue) {
          let page = await session.Page(`https://web.whatsapp.com/send?phone=55${queue.phone}&text=${queue.message}`);
          if (page && page.error) continue;

          let message = await session.Send();
          if (message && message.error) continue;

          if (db.socket.sessions[session.session]) {
            await db.socket.sessions[session.session].emit('send_message', {
              date: new Date(),
              message: !message || !message.error ? 'A mensagem foi enviada com sucesso...' : false, 
              error: message && message.error ? message.error : false,
              request: session.queue[0],
            })
          }

          session.queue.splice(0, 1)
          await Timeout(3000)
        }
      }


      await Timeout(5000)
      return Controller();


    // let session = db.whatsapp.sessions[user]
    // let page_message = await session.Page(`https://web.whatsapp.com/send?phone=55${session.queue[0].phone}&text=${session.queue[0].message}`)
    // if (page_message && page_message.error) return page_message;

    // let message = await session.Send_Message()
    // if (db.socket.sessions[user]) {
    //   await db.socket.sessions[user].emit('send_message', {
    //     date: new Date(),
    //     message: message && message.error ? false : 'A mensagem foi enviada com sucesso...', 
    //     error: message && message.error ? message.error : false,
    //     request: session.queue[0],
    //   })
    // }

    // session.queue.splice(0, 1)
    // if (session.queue[0]) return Message(user);
  } catch(err) {
    return Errors(err, `Controller ${__dirname}`)
      .then(() => { return Controller(req, res) })
      .catch((e) => e)
  }
}

module.exports = Controller