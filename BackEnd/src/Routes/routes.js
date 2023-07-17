const { readdirSync } = require("fs");
let routes = {}

module.exports = async (req, res, type, route = routes) => {
  let params = req.params[0].replace('/','').split("/")
  params[params.length] = type
  for (const param of params) {
    if (!route[param]) return res.status(500).send({ error: `O endereço da API é invalido...` });
    route = route[param];    
  }
  if (typeof route !== 'function') return res.status(500).send({ error: `O endereço da API está incompleto...` });
  route = await route(req, res)
  if (!route) return res.status(500).send({ error: `O endereço da API não retornou uma resposta...` })
  return res.status(route.status || 200).send(route)
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
