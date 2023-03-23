function load() {
  var url = window.location.pathname.split('/')
  if (url[2]) return $(document.body).load(`/views/${url[1]}/${url[2]}.html`)
  if (url[1]) return $(document.body).load(`/views/${url[1]}.html`)
  return $(document.body).load(`/views/main.html`)
}(function () { load() })()