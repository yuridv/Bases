const { Errors, Timeout } = require('../Utils/functions')

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
    await this.page.setDefaultNavigationTimeout()
  }

  async Page(url) {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.goto(url)
    ])
  }

  async isConnect() {

  }

  async Connect() {
    
  }

  async Infinity() {
    setInterval(()=>{
      try {

      } catch(err) {

      }
    }, 5000)
  }
}

module.exports = WhatsApp