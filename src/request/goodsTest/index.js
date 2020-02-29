/* From new projects */

import request from '../basic'

// let baseURL = ''
// if (process.env.NODE_ENV === 'development') {
//   baseURL = 'http://10.16.30.9:7777'
// } else if (process.env.NODE_ENV === 'production') {
//   baseURL = 'http://192.168.1.120:7777'
// }

let apiPrefix = ''
if (process.env.NODE_ENV === 'development') {
  apiPrefix = 'http://10.193.198.8:7777'
} else if (process.env.NODE_ENV === 'production') {
  let hostStr = location.protocol + '//' + location.hostname
  apiPrefix = hostStr + ':7777'
}

// 接触绑定银行卡
export function createOrder (data) {
  return request({
    baseURL: apiPrefix,
    headers: {'Content-Type': 'application/json'},
    url: '/order/createOrder',
    method: 'post',
    data
  })
}
