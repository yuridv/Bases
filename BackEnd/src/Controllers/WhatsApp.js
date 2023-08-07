const { Errors, Timeout } = require('../Utils/functions');
const { db } = require('../Utils/moldes');
const puppeteer = require('puppeteer');
const Browser = require("./Browser");

class WhatsApp extends Browser {
  constructor(session) {
    super(session);
    this.session = session;
  }

  async isConnected() {
    if (['CONECTADO'].includes(this.status)) return true;
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

    return {};
  }
}

module.exports = WhatsApp