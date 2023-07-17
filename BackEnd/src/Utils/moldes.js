const { readdirSync } = require("fs");

function files(dir = '', obj = {}) {
  readdirSync('./src/Utils/Moldes/'+dir).forEach(async(file) => {
    file = file.split('.')
    if (['routes'].includes(file[0])) return;
    if (file[1] == 'js') return obj[file[0]] = require(`${dir || './Moldes'}/${file[0]}`)
    obj[file[0]] = {}
    files(`${dir || './Moldes'}/${file[0]}`, obj[file[0]])
  })
  return obj;
}

module.exports = files()