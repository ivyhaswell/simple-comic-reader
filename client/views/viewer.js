const { ipcRenderer } = require("electron")
import { parse_hash } from "../utils/base.js"
import { Comic, read_comics_from_dir } from "../utils/comic.js"

class ViewerPage extends HTMLElement {
  state = {
    images: [],
    index: 0,
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const { query } = parse_hash(window.location.hash)
    const comic = Comic.fetch(query.id)
    this.state.images = read_comics_from_dir(comic.path)

    this.render()

    ipcRenderer.invoke('set-fullscreen', true)
  }

  render() {
    const templates = (state) => `
    <style>
    .container {
      height: 100vh;
      background-color: #212121;
      position: relative;
      display: flex;
      justify-content: center;
    }

    .comic-page{
      height: 100%;
    }

    .indicator {
      left: 2%;
      bottom: 2%;
      position: absolute;
      padding: 8px 12px;
      font-size: 12px;
      color: hsla(0,0%,100%,.7);
      background-color: rgba(48,48,48,.7);
      border-radius: 3px
    }

    </style>
    <div class="container">
      <img class="comic-page" src="${state.images[state.index]}" />
      <div class="indicator">${state.index + 1}/${state.images.length}</div>
    </div>
    `

    this.shadowRoot.innerHTML = templates(this.state)
  }

  connectedCallback() {
    window.addEventListener('keydown', this.handle_keydown.bind(this))
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handle_keydown.bind(this))
  }

  handle_keydown(e) {
    console.log(e)
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        this.next_page()
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        this.prev_page()
        break
      case 'Escape':
        ipcRenderer.invoke('set-fullscreen', false)
      default:
        break
    }
  }

  next_page() {
    if (this.state.index === this.state.images.length - 1) return
    this.state.index += 1
    this.render()
  }

  prev_page() {
    if (this.state.index === 0) return
    this.state.index -= 1
    this.render()
  }

}

customElements.define('viewer-page', ViewerPage)
