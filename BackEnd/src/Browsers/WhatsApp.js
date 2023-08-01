const { Errors, Timeout } = require('../Utils/functions')
const puppeteer = require('puppeteer')

class WhatsApp {
  constructor() {

  }

  async Browser() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: [ '--window-size=800,600', '--disable-features=site-per-process' ],
      defaultViewport: null
    });

    this.page = await this.browser.newPage();
    await this.page.setDefaultNavigationTimeout(0)

    this.Status();
  }

  async Close() {
    if (this.interval) clearInterval(this.interval);
    if (this.browser) await this.browser.close();
    this.browser = false;
    this.status = false;
    this.qr = false;
  }

  async Page(url) {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.goto(url)
    ])
  }

  async isConnected() {
    return false;
  }

  async Connect() {
    
  }

  async Status() {
    this.interval = setInterval(async ()=>{
      try {
        let check = await this.page.evaluate(async() => {
          if (document.querySelector('div._2I5ox > div > canvas')) {
            return { status: 'Aguardando ler o QR Code...', qr: document.querySelector('div._2I5ox > div > canvas').toDataURL() }
          } else if (document.querySelector('div._2I5ox > div')) {
            return { status: 'Aguardando gerar QR Code...', qr: false }
          } else return { status: false, qr: false }
        })
        if (this.status != check.status) {
          this.status = check.status

        }
        if (this.qr != check.qr) {
          this.qr = check.qr

        }
      } catch(err) {
        console.log(err)
        console.log(`[Browser WhatsApp/Status]=> Ocorreu algum ERRO na minha API...`)
      }
    }, 5000)
  }

  async Wait(func, max = 1, r) {
    return new Promise(async (res, rej) => {
      try {
        if (r >= max) return rej({ error: `Não foi possivel executar a função:\n\n${typeof func == 'string' ? func : func.toISOString()}` })
        if (this.error) return { error: this.error }
        let wait = await this.page.waitForFunction(func)
        return res(wait || {})
      } catch(err) {
        if ((`r: ${err}`).includes('30000ms') || (`r: ${err}`).includes('context was destroyed')) {
          await Timeout(1000)
          return this.Wait(func, max, r ? r++ : 0)
            .then(()=>{ res({}) })
            .catch((err)=>{ rej(err) })
        }
        console.log(err);
        console.log(`[Wait]=> ${err}`);
      }
    })
  }
}

module.exports = WhatsApp