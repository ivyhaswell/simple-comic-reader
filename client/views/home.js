const { ipcRenderer } = require('electron')
import { Comic } from '../utils/comic.js'


class HomePage extends HTMLElement {

  state = {
    comics: Comic.list()
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.render()
  }

  render() {
    const template_str = (state) => `
      <style>
      .container{
        padding: 12px 12px;
        background-color: #ffd591;
        min-height: calc(100vh - 24px);
        overflow: hidden;
      }
      .wrap{
        display: flex;
        flex-wrap: wrap;
      }
      .add-button{
        background-color: white;
        border-radius: 7px;
        width: 180px;
        height: 240px;
        line-height: 220px;
        text-align: center;
        cursor: pointer;
        margin: 12px;
        font-size: 44px;
        font-weight: bold;
      }
      .comic{
        margin: 12px;
        width: 180px;
      }
      .comic .image{
        background-color: white;
        border-radius: 7px;
        width: 180px;
        height: 240px;
        cursor: pointer;
        background-size: cover;
        background-repeat: no-repeat;
        // background-position: center;
      }
      .comic .name{
        font-size: 15px;
        line-height: 23px;
        color: #612500;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        margin-top: 7px;
      }
      </style>
      <div class="container">
        <div class="wrap">
          <div id="add" class="add-button">+</div>
          ${state.comics.map(c => `
            <div class="comic" id="${c.id}">
            <div class="image" style="background-image: url('${c.bg}')"></div>
            <div class="name">${c.name}</div>
          </div>`).join('\n')}
        </div>
      </div>`

    this.shadowRoot.innerHTML = template_str(this.state)
    this.attach_events()
  }

  connectedCallback() {
    // this.attach_events(this)
  }

  attach_events() {
    const add = this.shadowRoot.querySelector('#add')

    add.onclick = async () => {
      const { canceled, filePaths = [] } = await ipcRenderer.invoke('open-folder')
      if (canceled || !filePaths.length) return

      const dir_path = filePaths[0]
      if (Comic.has(dir_path)) return

      Comic.add(Comic.new(filePaths[0]))
      this.state.comics = Comic.list()
      this.render()
    }

    const comics = this.shadowRoot.querySelectorAll('.comic')
    comics.forEach(c => {
      c.onclick = () => {
        window.location.hash = `/viewer?id=${c.id}`
      }
    })

    this.shadowRoot.addEventListener('click', (e) => {
      console.log(e)
    })
  }
}

customElements.define('home-page', HomePage)
