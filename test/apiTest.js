const axios = require('axios')
axios.get('http://localhost:8888/public/index.html')
.then(res => {
    console.log('data:', res.data)
})
.catch(err => console.log('err:', err))