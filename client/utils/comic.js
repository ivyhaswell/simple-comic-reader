const path = require('path')
const fs = require('fs')

export function random_id() {
  return Math.random().toFixed(16) + Date.now()
}

const image_extensions = ['.png', '.jpg', '.jpeg', '.bmp']
export function is_image(url) {
  return image_extensions.includes(path.extname(url))
}

export function read_comics_from_dir(dir_path) {
  try {
    return fs.readdirSync(dir_path).filter(is_image).map(f => path.resolve(dir_path, f))
  } catch (error) {
    return []
  }
}

export class Comic {
  static key = 'comics'

  static list() {
    try {
      const res = localStorage.getItem(Comic.key)
      return JSON.parse(res) || []
    } catch (error) {
      return []
    }
  }

  static fetch(id) {
    return Comic.list().find(b => b.id === id)
  }

  static update(comics = []) {
    try {
      localStorage.setItem(Comic.key, JSON.stringify(comics))
      return true
    } catch (error) {
      return false
    }
  }

  static new(dir_path) {
    const basename = path.basename(dir_path)
    const files = fs.readdirSync(dir_path).filter(is_image)
    const bg = path.resolve(dir_path, files[0])
    const book = { name: basename, path: dir_path, bg, id: random_id() }

    return book
  }

  static add(book) {
    const books = Comic.list()
    books.push(book)
    Comic.update(books)
  }

  static delete(id) {
    const books = Comic.list()
    Comic.update(books.filter(book => book.id !== id))
  }
}
