(async () => {
  let url = false;
  var parms = window.location.pathname.split('/')
  if (parms[3] && !url) url = `/views/${parms[1]}/${parms[2]}/${parms[3]}.html`;
  if (parms[2] && !url) url = `/views/${parms[1]}/${parms[2]}.html`;
  if (parms[1] && !url) url = `/views/${parms[1]}.html`;
  if (url == '/views/main.html') return window.location.href = '/';
  if (!url) url = '/views/main.html'

  let html = await fetch(url || `/views/main.html`)
    .then(response => response.text())
    .catch(() => {})
  if (!html) return window.location.href = '/';

  let index = '<!DOCTYPE html>\n<html lang="en">'+document.documentElement.innerHTML+'</html>'
  let body = index.slice(index.indexOf('<body>') + 6, index.indexOf('</body>'));

  document.open();
  document.write(index.replace(body, html));
  document.close();

  let css = url ? url.replace('/views/','/public/css/').replace('.html','.css') : false;
  if (css) document.getElementById('css').href = css || `/public/css/main.css`;
})()