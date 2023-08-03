(async () => {
  let url = '/views'+window.location.pathname+'.html';
  if (url == '/views/main.html') return window.location.href = '/';
  if (url == '/views/.html') url = '/views/main.html'

  let html = await fetch(url.toLowerCase())
    .then(response => response.text())
    .catch(() => {})
  if (!html) return window.location.href = '/';

  await Load(document.body, html)

  let css = url ? url.replace('/views/','/public/css/').replace('.html','.css') : false;
  if (css) document.getElementById('css').href = css || `/public/css/main.css`;
})()