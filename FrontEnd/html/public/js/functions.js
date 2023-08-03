const Timeout = async (ms) => new Promise(res => setTimeout(res, ms))

const Load = async (element, html) => {
  element.innerHTML = html
  let scripts = element.getElementsByTagName('script')
  for (let i = 0; i < scripts.length; i++) {
    let script = document.createElement("script");
    if (scripts[0].innerHTML) script.innerHTML = scripts[0].innerHTML;
    if (scripts[0].src) script.setAttribute('src', scripts[0].src);
    element.appendChild(script);
    scripts[0].remove();
  }
}