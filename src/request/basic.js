import axios from 'axios'
import qs from 'qs'
import global from '@/config/global'

// 创建axios实例
const service = axios.create({
  baseURL: global.apiPrefix, // api的base_url
  timeout: 60 * 10 * 1000, // 请求超时时间
  headers: {
    // 'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(
  config => {
    const sessionId = sessionStorage.getItem('sessionId')
    if (sessionId) {
      config.headers['sessionId'] = sessionId
    }
    if (config.contentType) {
      config.headers['Content-Type'] = config.contentType
    }
    // console.log(config.headers['Content-Type'])
    // if (!config.contentType || (config.contentType && (config.contentType.indexOf('application/json') === -1 || config.contentType.indexOf('multipart/form-data') === -1))) {
    if (config.headers['Content-Type'].indexOf('application/json') === -1 && config.headers['Content-Type'].indexOf('multipart/form-data') === -1) {
      config.transformRequest = [(data) => { // 允许在向服务器发送前，修改请求数据，只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法，并且contentType不等于application/json
        return qs.stringify(data)
      }]
    }
    config.paramsSerializer = (params) => { // 是一个负责 `params` 序列化的函数
      return qs.stringify(params)
    }
    return config
  }, error => {
    // upe.ui.error(error)
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.data.code === '1') {
      console.log('操作成功：' + response.data.message)
    }
    if (response.data.code === '10') {
      console.log('操作失败：' + response.data.message)
    }
    if (response.data.code === 500) {
      // upe.ui.error(response.data.errMessage)
      return Promise.reject(response.data.error)
    }
    return response.data
  },
  error => {
    // upe.ui.error(error)
    return Promise.reject(error)
  }
)

export default service
