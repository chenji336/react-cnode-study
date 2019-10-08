const axios = require('axios')
const queryString = require('query-string') // 对象转成a=1&&b=2

const baseUrl = 'https://cnodejs.org/api/v1'

module.exports = function (req, res, next) {
  const path = req.path // app.use('/api) 中api不会包含的
  const user = req.session.user || {} // 后续需要点出属性，所以至少要为{}
  const needAccessToken = req.query.needAccessToken

  // 判断需不需要登录
  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }

  const query = Object.assign({}, req.query, {
    accesstoken: needAccessToken && req.method === 'GET' ? user.accessToken : ''
  })
  if (query.needAccessToken) {
    delete query.needAccessToken
  }
  console.log('method:', queryString.stringify(Object.assign({}, req.body, {
    accesstoken: needAccessToken && req.method === 'POST' ? user.accessToken : ''
  })))
  axios(`${baseUrl}${path}`, {
    method: req.method, // 获取方法
    params: query,
    data: queryString.stringify(Object.assign({}, req.body, {
      accesstoken: needAccessToken && req.method === 'POST' ? user.accessToken : ''
    })),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' // cnode有的接口使用application/json会出现问题
    }
  })
    .then(resp => {
      if (resp.status === 200) {
        res.send(resp.data)
      } else { // 主要是处理其他的2xx，如果是3xx、4xx、5xx直接跳到catch里面
        res.status(resp.status).send(resp.data)
      }
    })
    .catch(err => { // 3xx、4xx、5xx跳转到这里
      if (err.response) {
        console.log('err.response:', err.response)
        res.status(500).send(err.response.data)
      } else {
        res.status(500).send({
          success: false,
          msg: '未知错误'
        })
      }
    })
}
