const load = (element, file) => new Promise(async (res, rej) => {
  if (!element || !file) return rej({ error: `O elemento ou arquivo não foi definido...` })
  let html = await fetch(file).then(response => response.text());
  if (!html) return rej({ error: `O arquivo não foi encontrado...` })
  element.innerHTML = html
})