const { isAuthenticated, MSSQL } = require('../Utils/functions')
const { readdirSync } = require("fs");
let routes = {}

module.exports = async (req, res) => {
  req.method = req.method.toLowerCase()
  let route = routes
  let params = req.params[0].replace('/','').split("/")
  for (const param of params) {
    if (!route[param]) return res.status(500).send({ error: `O endereço da API é invalido...` });
    route = route[param];
  }
  if (!route) return res.status(404).send({ error: `A URI inserida não foi encontrada...` });
  if (!route[req.method] || typeof route[req.method] != 'function') return res.status(405).send({ error: `O metodo solicitado é invalido para essa URI...` });
  let pool = await MSSQL();
  if (pool.error) return rej(pool);
  return isAuthenticated(req, pool)
    .then(async (login) => {
      route = await route[req.method](req, res, login, pool)
      if (!route) return res.status(502).send({ error: `O endereço da API não retornou uma resposta valida...` })
      return res.status(route.status || 200).send(route)
    })
    .catch((e) => { return res.status(e.status || 401).send(e); })
}

function files(dir = '', obj = {}) {
  readdirSync('./src/Routes/'+dir).forEach(async(file) => {
    file = file.split('.').map(r=> r.toLowerCase())
    if (['routes'].includes(file[0])) return;
    if (file[1] == 'js') return obj[file[0]] = require(`${dir || '.'}/${file[0]}`)
    obj[file[0]] = {}
    files(`${dir || '.'}/${file[0]}`, obj[file[0]])
  })
  return obj;
}(() => { routes = files() })();


/*
STATUS CODE:
  200 - OK - SUCESSO
  201 - CREATED - SUCESSO POST
  202 - ACCEPTED - ENTROU NA FILA
  204 - NO CONTENT - SEM CONTEUDO PARA RESPONDER
  301 - MOVED PERMANENTLY - A URI MUDOU
  400 - BAD REQUEST - SINTAX INVALIDA
  401 - UNAUTHORIZED - NÃO AUTENTICADO
  403 - FORBIDDEN - SEM AUTORIZAÇÃO
  404 - NOT FOUND - NÃO ENCONTRADO
  405 - METHOD NOT ALLOWED - METODO SOLICITADO INVALIDO
  409 - CONFLICT - REQUEST ENTROU EM CONFLITO
  423 - LOCKED - CONTEUDO TRAVADO
  429 - MUITAS REQUICIÇÕES
  500 - INTERNAL SERVER ERROR - SITUAÇÃO INESPERADA
  502 - BAD GATEWAY - API RETORNOU UMA RESPOSTA INVALIDA
  503 - SERVICE UNAVAILABLE - SERVIDOR EM MANUTENÇÃO
  504 - GATEWAY TIMEOUT - REQUEST DEMOROU MUITO
  508 - LOOP DETECTED - LOOP INFINITO DETECTADO
*/ 