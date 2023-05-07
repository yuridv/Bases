async function load() {
  let url = false;
  var parms = window.location.pathname.split('/')
  if (parms[3] && !url) url = `/views/${parms[1]}/${parms[2]}/${parms[3]}.html`
  if (parms[2] && !url) url = `/views/${parms[1]}/${parms[2]}.html`
  if (parms[1] && !url) url = `/views/${parms[1]}.html`
  if (!url) return $(document.body).load(`/views/main.html`)
  $.ajax({ url: url, type: 'HEAD',
    success: function () { 
      let css = url ? url.replace('/views/','/public/css/').replace('.html','.css') : false
      document.getElementById('css').href = css || `/public/css/main.css`
      $(document.body).load(url || `/views/main.html`) 
    },
    error: function () { window.location.href = '/' }
  })
}(function () { load() })()