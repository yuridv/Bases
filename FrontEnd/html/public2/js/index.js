async function verify() {
  let url = false;
  var parms = window.location.pathname.split('/')
  if (parms[3] && !url) url = `/views/${parms[1]}/${parms[2]}/${parms[3]}.html`;
  if (parms[2] && !url) url = `/views/${parms[1]}/${parms[2]}.html`;
  if (parms[1] && !url) url = `/views/${parms[1]}.html`;
  if (url == '/views/main.html') return window.location.href = '/';
  if (!url) url = '/views/main.html'
  fetch(url, { method: 'HEAD' })
    .then(async(r) => {
      let css = url ? url.replace('/views/','/public2/css/').replace('.html','.css') : false;
      document.getElementById('css').href = css || `/public2/css/main.css`;
      return load(document.body, url || `/views/main.html`);
    }).catch(async() => { window.location.href = '/' });
}(function () { verify() })()