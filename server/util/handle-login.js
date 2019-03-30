const router = require('express')() // 3.x是app.router,4.x不建议这么使用了
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1 '

// 如果 login 不是 /login 会怎样,不影响
// 就算不用router也是需要使用express.post的，因为要添加login路由
router.post('/login', function(req, res, next) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  })
    .then(resp => {
      if (resp.status === 200 && resp.data.success) {
        // 保存cookie,后续别的页面要判断req.session.user是否具有内容
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url,
        }

        res.json({
          success: true, // success应该也可以取消掉，因为data里面也有success
          data: resp.data,
        })
      }
    })
    .catch(err => {
      if (err.response) { // 服务端返回的是2xx以外的数据
        res.json({
          success: false,
          data: err.response.data
        })
      } else { // 把错误抛给下一个中间件
        next(err)
      }
    })
})

module.exports = router
