export function template(strings, ...keys) {
  return (function (...values) {
    let dict = values[values.length - 1] || {}
    let result = [strings[0]]
    keys.forEach(function (key, i) {
      result.push(dict[key], strings[i + 1])
    })
    return result.join('')
  });
}

export function parse_hash(hash) {
  const href = hash.replace('#', '')
  const [path = '', search = ''] = href.split('?')
  const query = {}
  search.split('&').forEach(q => {
    const [key, val] = q.split('=')
    query[key] = val
  })

  return { path, search, query, href }
}