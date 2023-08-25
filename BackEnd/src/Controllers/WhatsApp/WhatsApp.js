const { Errors, Timeout } = require('../../Utils/functions');
const { db } = require('../../Utils/moldes');
const Status = require("./Status");

class WhatsApp extends Status {
  constructor(session) {
    super(session);
    this.session = session;
  }

  async isConnected() {
    if (['Conectado', 'Mensagem'].includes(this.status)) return true;
    return false;
  }

  async Disconnect() {
    if (!await this.isConnected()) return { error: `Você já está desconectado...` }
    let verify = await this.Evaluate(() => {
      let el = document.querySelector('div:nth-child(5) > div')
      if (!el) return { error: `Não foi possivel encontrar o botão de menu para se desconectar...` }
      document.querySelector("div:nth-child(5) > div").click();
    }, [])
    if (verify.error) return verify;

    await this.Wait('document.querySelector("li:nth-child(6)")')
    await this.Evaluate('document.querySelector("li:nth-child(6)").click()', [])

    await this.Wait('document.querySelector("button.emrlamx0.aiput80m.h1a80dm5.sta02ykp.g0rxnol2.l7jjieqr.hnx8ox4h.f8jlpxt4.l1l4so3b.le5p0ye3.m2gb0jvt.rfxpxord.gwd8mfxi.mnh9o63b.qmy7ya1v.dcuuyf4k.swfxs4et.bgr8sfoe.a6r886iw.fx1ldmn8.orxa12fk.bkifpc9x.hjo1mxmu.oixtjehm")')
    await this.Evaluate('document.querySelector("button.emrlamx0.aiput80m.h1a80dm5.sta02ykp.g0rxnol2.l7jjieqr.hnx8ox4h.f8jlpxt4.l1l4so3b.le5p0ye3.m2gb0jvt.rfxpxord.gwd8mfxi.mnh9o63b.qmy7ya1v.dcuuyf4k.swfxs4et.bgr8sfoe.a6r886iw.fx1ldmn8.orxa12fk.bkifpc9x.hjo1mxmu.oixtjehm").click()', [])
  }

  async Send() {
    if (await this.isConnected() && this.queue[0]) {
      try {
        await this.Evaluate(async (phone, message) => {
          const el = document.createElement("a");
          el.setAttribute("href", `whatsapp://send?phone=${phone}&text=${message}`);
          document.body.append(el);
          el.click();
          document.body.removeChild(el);
        }, [ this.queue[0].phone, this.queue[0].message ])
        
        await this.Wait('document.querySelector("div._2xy_p._3XKXx > button > span > svg")')
    
        await this.Evaluate(async ()=>{
          let el = document.querySelector("div._2xy_p._3XKXx > button > span")
          if (!el) return { error: `Não encontrei o botão de enviar a mensagem...` }
          el.click()
        }, [])

        if (db.socket.sessions[this.queue[0].author]) {
          await db.socket.sessions[this.queue[0].author].emit('send_message', {
            date: new Date(),
            message: 'A mensagem foi enviada com sucesso...',
            request: this.queue[0],
          })
        }
      } catch(err) {
        if (this.queue[0].author && db.socket.sessions[this.queue[0].author]) {
          await db.socket.sessions[this.queue[0].author].emit('send_message', {
            date: new Date(),
            error: err ? err : 'Ocorreu algum erro indefinido',
            request: this.queue[0],
          })
        } else {
          console.log(err)
          console.log(`[Controllers WhatsApp/Evaluate]=> ${err}`);
        }
      }
      this.queue.splice(0, 1)
    }
    await Timeout(this.queue.length > 0 ? Number(`${Math.floor(Math.random() * (20 - 5 + 1) + 5)}000`)  : 20000)
    return this.Send()
  }
}

module.exports = WhatsApp