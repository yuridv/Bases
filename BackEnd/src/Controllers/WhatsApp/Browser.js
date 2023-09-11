const { Errors, Timeout } = require('../../Utils/functions');
const { db } = require('../../Utils/moldes');
const puppeteer = require('puppeteer');

class Browser {
  constructor(session) {
    this.browser = false;
    this.page = false;
    this.queue = [];
    // this.Send();
  }

  async Browser() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: [ '--window-size=800,600', '--disable-features=site-per-process' ],
      defaultViewport: null,
      userDataDir: `./src/Utils/Cache/${this.session}`
    });

    this.page = await this.browser.newPage();
    await this.page.setDefaultNavigationTimeout(0)

    this.Status();
  }

  async Close() {
    if (this.interval) clearInterval(this.interval);
    if (this.browser) await this.browser.close();
    this.browser = false;
    this.status = 'Desconectado';
    this.qr = false;
    if (db.socket.sessions[this.session]) {
      await db.socket.sessions[this.session].emit('change_status', this.status)
      await db.socket.sessions[this.session].emit('change_qr', this.qr)
    }
  }

  async Page(url) {
    try {
      await Promise.all([
        this.page.waitForNavigation(),
        this.page.goto(url, { waitUntil: 'domcontentloaded' })
      ])
    } catch(err) {
      console.log(err);
      console.log(`[Browser/Page]=> ${err}`);
    }
  }

  async Wait(func, r = 1) {
    return new Promise(async (res, rej) => {
      try {
        if (r >= 3) return rej({ error: `Não foi possivel executar a função:\n\n${typeof func == 'string' ? func : func.toISOString()}` })
        let wait = await this.page.waitForFunction(func)
        return res(wait || {})
      } catch(err) {
        if ((`r: ${err}`).includes('30000ms') || (`r: ${err}`).includes('context was destroyed')) {
          await Timeout(1000)
          return this.Wait(func, (r || 0) + 1)
            .then(()=>{ res({}) })
            .catch((err)=>{ rej(err) })
        } else if ((`r: ${err}`).includes('Target closed') || (`r: ${err}`).includes(`Session closed`)) {
          this.browser = false;
          await this.Close()
          return rej({ error: 'O navegador fechou! Tente novamente...' }) 
        }
        console.log(err);
        console.log(`[Controllers Browser/Wait]=> ${err}`);
      }
    })
  }

  async Evaluate(func, args, r = 1) {
    return new Promise(async (res, rej) => {
      try {
        if (r >= 3) return rej({ error: `Não foi possivel executar a função:\n\n${typeof func == 'string' ? func : func.toISOString()}` })
        let evaluate = await this.page.evaluate(func, ...args)
        return res(evaluate || {})
      } catch(err) {
        if ((`r: ${err}`).includes('30000ms') || (`r: ${err}`).includes('context was destroyed')) {
          await Timeout(1000)
          return this.Evaluate(func, args, (r || 0) + 1)
            .then(()=>{ res({}) })
            .catch((err)=>{ rej(err) })
        } else if ((`r: ${err}`).includes('Target closed') || (`r: ${err}`).includes(`Session closed`)) {
          this.browser = false;
          await this.Close()
          return rej({ error: 'O navegador fechou! Tente novamente...' }) 
        }
        console.log(err);
        console.log(`[Controllers Browser/Evaluate]=> ${err}`);
      }
    })
  }

}

module.exports = Browser