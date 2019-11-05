import axios from 'axios'

const baseUrl = process.env.API_BASE || ''

const parseUrl = (url, params) => {
  const str = Object.keys(params).reduce((result, key) => (
    `${result}${key}=${params[key]}&`
  ), '')
  return `${baseUrl}/api/${url}?${str.substr(0, str.length - 1)}`
}

export const get = (url, params = {}) => new Promise((resolve, reject) => {
  axios(parseUrl(url, params))
    .then((resp) => {
      const { data } = resp
      if (data && data.success) {
        resolve(data)
      } else {
        reject(data)
      }
    })
    .catch(reject)
})

export const post = (url, params, postData) => new Promise((resolve, reject) => {
  axios.post(parseUrl(url, params), postData)
    .then((resp) => {
      const { data } = resp
      if (data && data.success) {
        resolve(data)
      } else {
        reject(data)
      }
    })
    .catch(reject)
})
