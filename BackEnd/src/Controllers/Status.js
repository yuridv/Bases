const { Errors, Timeout } = require('../Utils/functions');
const { db } = require('../Utils/moldes');
const puppeteer = require('puppeteer');

class Status {
  constructor(session) {
    this.status = 'Desconectado';
    this.qr = false;
  }

  async Status() {
    try {
      if (!this.browser || !this.page) return;
      this.interval = setInterval(async ()=>{
        try {
          let check = await this.Evaluate(async (status_list)=> {
            let status = status_list.find(r=> document.querySelector(r.id))
            if (status) {
              if (status.html) {
                let html = status_list.find(r=> r.html && document.querySelector(r.id) && r.html == document.querySelector(r.id).innerHTML)
                if (html) {
                  if (html.status) return { status: html.status, qr: false }
                  return { status: document.querySelector(html.id).innerHTML, qr: false }
                } else return { status: '[Não Indentificado]=> ' + document.querySelector(status.id).innerHTML, qr: false }
              } else if (status.qr) {
                return { status: status.status, qr: document.querySelector(status.id).toDataURL() }
              } else return { status: status.status, qr: false }
            } else return { status: 'Não Indentificado...', qr: false }
          }, [ status_list ])

          if (check.status != this.status) {
            this.status = check.status;
            if (db.socket.sessions[this.session]) await db.socket.sessions[this.session].emit('change_status', check.status)
          }
          if (check.qr != this.qr) {
            this.qr = check.qr;
            if (db.socket.sessions[this.session]) await db.socket.sessions[this.session].emit('change_qr', check.qr)
          }
        } catch(err) {
          if (this.interval) clearInterval(this.interval);
          if (err.error) return console.log(err);
          console.log(err)
          console.log(`[Browser WhatsApp/Status Interval]=> Ocorreu algum ERRO na minha API...`)
        }
      }, 1000)
    } catch(err) {
      if (this.interval) clearInterval(this.interval);
      if (err.error) return console.log(err);
      console.log(err)
      console.log(`[Browser WhatsApp/Status]=> Ocorreu algum ERRO na minha API...`)
    }
  }
}

module.exports = Status

let status_list = [
  { id: 'div._2I5ox > div > canvas', status: 'QRcode Gerado...', qr: true }, // 3
  { id: 'div._2I5ox > div', status: 'Gerando QRcode...' }, // 2
  { id: '#initial_startup', status: 'Iniciando o WhatsApp...' }, // 1
  { id: '#app > div > div > div._3HbCE', html: 'WhatsApp', status: 'Carregando seu WhatsApp...' }, // 4
  { id: '#app > div > div > div._3HbCE', html: 'Carregando suas conversas', status: '' }, // 4
  { id: 'div._3RpB9 > h1', html: 'WhatsApp Web', status: 'Conectado' }, // 5
  
  { id: '#app > div > div > div > div.lymqd4c5.e1gr2w1z._1afPD', html: 'Desconectando', status: '' }, // 5
]