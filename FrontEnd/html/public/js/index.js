(async () => {
  let url = '/views'+window.location.pathname+'.html';
  if (url == '/views/main.html') return window.location.href = '/';
  if (url == '/views/.html') url = '/views/main.html'

  let html = await fetch(url.toLowerCase())
    .then(response => response.text())
    .catch(() => {})
  if (!html) return window.location.href = '/';

  document.body.innerHTML = html

  let scripts = document.body.getElementsByTagName('script')

  // let script = document.createElement("script");
  // script.innerHTML = scripts[0].innerHTML;
  // document.body.appendChild(script);


  // let index = '<!DOCTYPE html>\n<html lang="en">'+document.documentElement.innerHTML+'</html>'
  // let body = index.slice(index.indexOf('<body>') + 6, index.indexOf('</body>'));

  // document.open();
  // document.write(index.replace(body, html));
  // document.close();

  let css = url ? url.replace('/views/','/public/css/').replace('.html','.css') : false;
  if (css) document.getElementById('css').href = css || `/public/css/main.css`;
})()