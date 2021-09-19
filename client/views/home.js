const container_html = `
  <div class="container">
    <div id="add" class="add-button">添加漫画</div>
  </div>
`

const style_content = `
  .container{
    background-color: #ffd591;
    min-height: 100vh;
    padding: 16px 12px;
  }
  .add-button{
    display: inline-block;
    background-color: white;
    border-radius: 4px;
    width: 80px;
    height: 108px;
    line-height: 100px;
    text-align: center;
    cursor: pointer;
  }
`

const {ipcRenderer} = require('electron')
const path = require('path')

class HomePage extends HTMLElement {
  constructor(){
    super()
    
    const shadow_root = this.attachShadow({mode: 'open'})

    const style = document.createElement('style')
    style.textContent = style_content

    const container = document.createElement('div')
    container.innerHTML = container_html

    shadow_root.appendChild(style)
    shadow_root.appendChild(container)

  }
  connectedCallback(){
    attach_events(this)
  }
}

customElements.define('home-page', HomePage)

function attach_events(elem) {
  const shadow_root = elem.shadowRoot
  const add = shadow_root.querySelector('#add')

  add.onclick = async () => {
    const {canceled, filePaths = []} = await ipcRenderer.invoke('open-folder')
    if(!canceled && filePaths.length){
      const dir_path = filePaths[0]
      const basename =  path.basename(dir_path)
      console.log('dir_path',dir_path)
      console.log('basename',basename)
    }
  }

}