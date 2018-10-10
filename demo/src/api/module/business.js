import fetch from './../fetch.js'

const information = {
  getBusinessList: params => {
    return fetch({
      url: '/pas/Business/select',
      params: params,
      method: 'get'
    })
  },
  getPaySelectList: () => {
    return fetch({
      url: '/pas/PayMethod/select',
      // params: params,
      method: 'get'
    })
  },
  saveInfo: (params) => {
    return fetch({
      url: '/pas/Business/create',
      params: params,
      method: 'post',
      responseType: 'JSON'
    })
  }
}
export default {
  information
}
