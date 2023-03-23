const { readdirSync } = require("fs");

async function routes(dir = '', obj = {}) {
  readdirSync('./src/Routes/'+dir).forEach(async(file) => {
    if (file == "routes.js") return;
    if (file.split('.')[1] == "js") return obj[file.split('.')[0].toLowerCase()] = require(`${dir ? dir : '.'}/${file}`);
    obj[file.toLowerCase()] = {}
    await routes(`${dir ? dir : '.'}/${file}`, obj[file.toLowerCase()])
  });
  return obj;
}

async function verify(routes, params) {
  if (params[0] && routes[params[0]]) routes = routes[params[0]]
  if (params[1] && routes[params[1]]) routes = routes[params[1]]
  if (params[2] && routes[params[2]]) routes = routes[params[2]]
  if (params[3] && routes[params[3]]) routes = routes[params[3]]
  if (routes && typeof routes == 'function') return routes
  return { error: `A rota da API não é valida...` }
}

module.exports = {
  routes: routes().then(r=> { return r }),
  verify: verify
}