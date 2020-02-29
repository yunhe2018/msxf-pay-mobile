// let apiPrefix = ''
// const {hostname, protocol} = window.location
// console.log(hostname)
// console.log(protocol)
// if (hostname.indexOf('localhost') >= 0) {
//   apiPrefix = `http://10.16.30.9:8889/face-pay-admin`
// } else if (hostname.indexOf('10.16.30.9') >= 0) {
//   apiPrefix = `${protocol}10.16.30.9:8889/face-pay-admin`
// } else if (hostname.indexOf('192.168.1.120') >= 0) { // 测试环境前后端域名
//   apiPrefix = `${protocol}192.168.1.120:8889/face-pay-admin`
// }
// console.log(apiPrefix)

let apiPrefix = ''
if (process.env.NODE_ENV === 'development') {
  apiPrefix = 'http://10.193.198.8/face-pay-admin'
  // apiPrefix = 'http://face-pay-admin-openp2-btest-8080.zkj.test/face-pay-admin'
} else if (process.env.NODE_ENV === 'production') {
  // let hostStr = location.protocol + '//' + location.hostname
  // apiPrefix = hostStr + ':8889/face-pay-admin'
  apiPrefix = '/face-pay-admin'
  // apiPrefix = location.protocol + '//' + 'face-pay-admin-openp2-btest-8080.zkj.test/face-pay-admin'
}

// if (process.env.NODE_ENV === 'development') {
//   apiPrefix = 'http://10.16.30.9:8889/face-pay-admin'
//   // apiPrefix = 'http://192.168.1.120:8889/face-pay-admin'
// } else if (process.env.NODE_ENV === 'production') {
//   apiPrefix = 'http://192.168.1.120:8889/face-pay-admin'
// }

module.exports = {
  apiPrefix
}
