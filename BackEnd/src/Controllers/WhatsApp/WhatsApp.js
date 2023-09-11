const { Errors, Timeout, Clients, MSSQL } = require('../../Utils/functions');
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
    if (await this.isConnected()) {
      try {
        let pool = await MSSQL('AGILUS');
        if (pool.error) return console.log(pool);
    
        let client = await pool.request().query(`
          ;WITH clients AS (
            SELECT TOP(100)
              c.con_nome 'nome'
              ,c.con_telefone 'telefone'
              ,ROW_NUMBER() OVER(PARTITION BY c.con_telefone ORDER BY c.con_codigo) 'r'
            FROM convenio c
              LEFT JOIN dash_temp_whats w ON w.client = c.con_telefone 
            WHERE w.data IS NULL
              AND c.con_telefone IS NOT NULL
              AND c.con_nome IS NOT NULL
            ORDER BY c.con_codigo DESC
          )
          SELECT TOP(1) telefone, nome FROM clients WHERE r = 1
        `).then(r=> r.recordset[0])
        // let client = await pool.request().query(`
        //   ;WITH clients AS (
        //     SELECT TOP(100)
        //       c.nome 'nome'
        //       ,c.Telefone 'telefone'
        //       ,ROW_NUMBER() OVER(PARTITION BY c.Telefone ORDER BY c.Telefone) 'r'
        //     FROM dash_whats_fones c
        //       LEFT JOIN dash_temp_whats w ON w.client = c.Telefone 
        //     WHERE w.data IS NULL
        //       AND c.Telefone IS NOT NULL
        //       AND c.nome IS NOT NULL
        //   )
        //   SELECT TOP(1) telefone, nome FROM clients WHERE r = 1
        // `).then(r=> r.recordset[0])
        if (!client) {
          console.log('[CLIENTES]=> NOT FOUND')
          await Timeout(20000)
          return this.Send();
        }
        client.phone = Number(client.telefone.replaceAll(' ','').replaceAll('(','').replaceAll(')','').replaceAll('-','').replaceAll('+',''))
        if (!client.phone || String(client.phone).length != 11) {
          await pool.request().query(`
            INSERT INTO dash_temp_whats (
              [author], [client], [result], [data]
            ) VALUES (
              '${this.session}', '${client.telefone}', 'Telefone invalido', GETDATE()
            )
          `)
          console.log('[Telefone invaldo]=> ' + client.telefone)
          return this.Send();
        }
        console.log('[START]=> ' + client.phone)
        let message = `Olá, ${client.nome}!
Nós, da Concrédito Consignados, estamos com taxas super baixas! Estamos fazendo financiamentos de carros, motos e caminhões com taxas muito abaixo do mercado! Nós também fazemos refinanciamentos, utilizando seu veículo como garantia.
Para mais informações, entre em contato por aqui ou com este número: +55 (51) 98298-2320.`

        let contact = await this.Evaluate(async (phone, message) => {
          let error_button = document.querySelector('span:nth-child(2) > div > span > div > div > div > div > div > div > div > button')
          let error_text = document.querySelector('#app > div > span:nth-child(2) > div > span > div > div > div > div > div > div.f8jlpxt4.iuhl9who')
          if (error_button && error_text && error_text.innerHTML == 'O número de telefone compartilhado através de url é inválido.') {
            error_button.click()
            return { error: '[1]=> O número de telefone não foi encontrado no WhatsApp' }
          } else {
            let contact = document.createElement("a");
            contact.setAttribute("href", `whatsapp://send?phone=${phone}&text=${message}`);
            document.body.append(contact);
            contact.click();
            document.body.removeChild(contact);
            return {}
          }
        }, [ client.phone, encodeURIComponent(message) ])

        if (contact.error) {
          await pool.request().query(`
            INSERT INTO dash_temp_whats (
              [author], [client], [result], [data]
            ) VALUES (
              '${this.session}', '${client.telefone}', '${contact.error}', GETDATE()
            )
          `)
          console.log(`[CONTACT Error ${client.telefone}]=> ` + contact.error)
          return this.Send();
        }

        await this.Wait(`
          document.querySelector('span:nth-child(2) > div > div._1VZX7 > div > div > div > p > span') || (
            document.querySelector('#app > div > span:nth-child(2) > div > span > div > div > div > div > div > div.f8jlpxt4.iuhl9who') &&
            document.querySelector('#app > div > span:nth-child(2) > div > span > div > div > div > div > div > div.f8jlpxt4.iuhl9who').innerHTML == 'O número de telefone compartilhado através de url é inválido.'
          )
        `)

        let send = await this.Evaluate(async () => {
          let error_button = document.querySelector('span:nth-child(2) > div > span > div > div > div > div > div > div > div > button')
          let error_text = document.querySelector('#app > div > span:nth-child(2) > div > span > div > div > div > div > div > div.f8jlpxt4.iuhl9who')
          if (error_button && error_text && error_text.innerHTML == 'O número de telefone compartilhado através de url é inválido.') {
            error_button.click()
            return { error: '[2]=> O número de telefone não foi encontrado no WhatsApp' }
          } else {
            let el = document.querySelector("div._2xy_p._3XKXx > button > span")
            if (!el) return { error: `Não encontrei o botão de enviar a mensagem...` }
            el.click()
            let menu = document.querySelector('div._3vsRF > div > div > span')
            if (menu) menu.click()
            return {}
          }
        }, [])
        if (send.error) {
          await pool.request().query(`
            INSERT INTO dash_temp_whats (
              [author], [client], [result], [data]
            ) VALUES (
              '${this.session}', '${client.telefone}', '${send.error}', GETDATE()
            )
          `)
          console.log(`[SEND Error ${client.telefone}]=> ` + send.error)
          return this.Send();
        }
        await Timeout(1500)
        await this.Evaluate(async () => {
          let close = document.querySelector('span:nth-child(4) > div > ul > div > div > li:nth-child(3) > div')
          if (close) close.click()
        }, [])

        await pool.request().query(`
          INSERT INTO dash_temp_whats (
            [author], [client], [result], [data]
          ) VALUES (
            '${this.session}', '${client.telefone}', 'Mensagem enviada', GETDATE()
          )
        `)

        console.log('[END]=> WAIT')
        await Timeout(Math.floor(Math.random() * (20 - 5 + 1) + 5) + '000')
        return this.Send();
      } catch(err) {
        console.log(err)
        console.log(`[Controllers WhatsApp/Send]=> ${err}`);
      }
    } else {
      await Timeout(20000)
      return this.Send();
    }
  }
}

module.exports = WhatsApp