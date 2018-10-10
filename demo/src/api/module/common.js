import fetch from './../fetch.js'
const login = (params) => {
  return fetch({
    url: '/pas/user/Session/login',
    // url: '/mock/login',
    data: params,
    method: 'post'
  })
}
export default {
  login
}
