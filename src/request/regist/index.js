/* From new projects */

import request from '../basic'

export function loginUser (data) {
  return request({
    // headers: {'Content-Type': 'application/json'},
    url: '/memberLogin/userLogin',
    method: 'post',
    data
  })
}

// 注册
export function register (data) {
  return request({
    headers: {'Content-Type': 'application/json'},
    url: '/memberh5/register',
    method: 'post',
    data
  })
}
// 绑卡
export function bindCard (data) {
  return request({
    headers: {'Content-Type': 'application/json'},
    url: '/memberh5/bindCard',
    method: 'post',
    data
  })
}
// 绑卡-提交
export function addBindCard (data) {
  return request({
    headers: {'Content-Type': 'multipart/form-data'},
    url: '/memberh5/addBindCard',
    method: 'post',
    data
  })
}
// 解除绑定银行卡
export function unbindCard (data) {
  return request({
    headers: {'Content-Type': 'multipart/form-data'},
    url: '/memberh5/unbindCard',
    method: 'post',
    data
  })
}
// 个人中心
export function getMember (data) {
  return request({
    headers: {'Content-Type': 'multipart/form-data'},
    url: '/memberh5/getMember',
    method: 'post',
    data
  })
}
// 获取验证码
export function getCode (data) {
  return request({
    headers: {'Content-Type': 'multipart/form-data'},
    url: '/sms/sendSysSms',
    method: 'post',
    data
  })
}
// 上传图片
export function uploadImg (cfg) {
  return request({
    headers: {'Content-Type': 'multipart/form-data'},
    url: '/upload/imgUpload',
    method: 'post',
    data: cfg
  })
}
// 忘记密码
export function forgetPsd (cfg) {
  return request({
    // headers: {'Content-Type': 'application/json'},
    headers: {'Content-Type': 'multipart/form-data'},
    url: '/password/reset',
    method: 'post',
    data: cfg
  })
}
// 重置密码
export function updatePsd (cfg) {
  return request({
    url: '/password/update',
    method: 'post',
    data: cfg
  })
}

// 支付
export function appOrder (data) {
  return request({
    url: 'appOrder/payOrder',
    method: 'post',
    data
  })
}
// 字典数据接口
export function sysDict (data) {
  return request({
    headers: {'Content-Type': 'multipart/form-data'},
    // headers: {'Content-Type': 'application/json'},
    url: '/sysDict/getSysDictByParentCode',
    method: 'post',
    data
  })
}
