import { parse_hash } from './utils/base.js'
import './views/home.js'
import './views/viewer.js'

const $app = document.querySelector('#app')

const router = {
  '/home': { component: 'home-page' },
  '/viewer': { component: 'viewer-page' },
}

function show_page_from_hash() {
  let { path } = parse_hash(window.location.hash)
  path = path || '/home'

  if (router[path]) {
    const { component } = router[path]
    $app.innerHTML = `<${component}></${component}>`
  }
}

window.addEventListener('hashchange', () => {
  show_page_from_hash()
}, false)

window.addEventListener('load', () => {
  // window.location.hash = '/home'
  // window.location.hash = ''
  show_page_from_hash()
})


