// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/facePayMobile/base.css'
import './assets/facePayMobile/reset.css'
import 'lib-flexible'
import './assets/facePayMobile/iconfont/iconfont.css'
import './assets/facePayMobile/iconfont/iconfont.js' // 要彩色就要这个js文件
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
