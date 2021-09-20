const { ipcRenderer } = require("electron")
import { parse_hash } from "../utils/base.js"
import { Comic, read_comics_from_dir } from "../utils/comic.js"

class ViewerPage extends HTMLElement {
  state = {
    images: [],
    index: 0,
    duration: 5,
    paging_enabled: false,
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const { query } = parse_hash(window.location.hash)
    const comic = Comic.fetch(query.id)
    this.state.images = read_comics_from_dir(comic.path)

    this.render()

    // ipcRenderer.invoke('set-fullscreen', true)
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
      max-height: 100%;
      max-width: 100%;
      display: block;
      margin: auto;
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

    .back {
      left: 2%;
      top: 2%;
      position: absolute;
      padding: 8px 12px;
      font-size: 12px;
      color: hsla(0,0%,100%,.7);
      background-color: rgba(48,48,48,.7);
      border-radius: 3px;
      cursor: pointer;
    }

    .paging-tool {
      right: 2%;
      bottom: 2%;
      position: absolute;
      display: flex;
      border-radius: 3px;
      padding: 8px 0;
      background-color: rgba(48,48,48,.7);
    }

    .tool-item {
      padding: 0 12px;
      font-size: 12px;
      color: hsla(0,0%,100%,.7);
      min-width: 20px;
      border-right: 1px solid hsla(0,0%,100%,.3);
      text-align: center;
    }

    .tool-item:last-child{
      border-right: none;
    }

    .tool-item.switch, .tool-item.plus, .tool-item.minus{
      cursor: pointer;
    }

    </style>
    <div class="container">
      <img class="comic-page" src="${state.images[state.index]}" />

      <div class="indicator">${state.index + 1}/${state.images.length}</div>
      <div class="back">返回</div>
      <div class="paging-tool">
        <div class="tool-item switch">${this.state.paging_enabled ? '关闭' : '开启'}自动翻页</div>
        <div class="tool-item duration">${this.state.duration}s</div>
        <div class="tool-item plus">+</div>
        <div class="tool-item minus">-</div>
      </div>
    </div>
    `

    this.shadowRoot.innerHTML = templates(this.state)
    this.attach_events()
  }

  connectedCallback() {
    window.addEventListener('keydown', this.handle_keydown.bind(this))
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handle_keydown.bind(this))
  }

  attach_events() {
    const $back = this.shadowRoot.querySelector('.back')
    $back.onclick = () => this.back_home()

    const $switch = this.shadowRoot.querySelector('.paging-tool .switch')
    $switch.onclick = () => this.toggle_paging()

    const $plus = this.shadowRoot.querySelector('.paging-tool .plus')
    $plus.onclick = () => this.change_paging_duration(1)

    const $minus = this.shadowRoot.querySelector('.paging-tool .minus')
    $minus.onclick = () => this.change_paging_duration(-1)
  }

  toggle_paging() {
    const paging_enabled = !this.state.paging_enabled
    paging_enabled ? this.start_paging() : this.stop_paging()

    this.state.paging_enabled = paging_enabled
    this.render()
  }

  timeout_id = null

  start_paging() {
    if (this.timeout_id) {
      this.next_page()
    }
    this.timeout_id = setTimeout(() => {
      this.start_paging()
    }, this.state.duration * 1000);
  }

  stop_paging() {
    clearTimeout(this.timeout_id)
  }

  change_paging_duration(addend) {
    this.state.duration = Math.max(this.state.duration + addend, 1)
    this.render()
  }

  back_home() {
    window.location.hash = '/home'
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
        // ipcRenderer.invoke('set-fullscreen', false)
        this.back_home()
        break;
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
