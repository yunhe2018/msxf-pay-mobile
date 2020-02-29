import Vue from 'vue'
import Router from 'vue-router'
// import layout from '@/view/layout/layout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: require('@/view/layout/index').default,
      redirect: '/login',
      children: [
        // {
        //   path: 'home',
        //   name: 'home',
        //   component: require('@/view/home/home').default,
        //   meta: {
        //     title: 'home页面'
        //   }
        // },
        {
          path: 'login',
          name: 'login',
          component: require('@/view/login/index').default,
          meta: {
            title: '登陆'
          }
        },
        {
          path: 'resetPsd',
          name: 'resetPsd',
          component: require('@/view/resetPsd/index').default,
          meta: {
            title: '重置密码'
          }
        },
        {
          path: 'forgetPsd',
          name: 'forgetPsd',
          component: require('@/view/forgetPsd/index').default,
          meta: {
            title: '忘记密码'
          }
        },
        {
          path: 'user',
          name: 'user',
          component: require('@/view/user/index').default,
          meta: {
            title: '个人中心'
          }
        },
        {
          path: 'regist',
          name: 'regist',
          component: require('@/view/regist/regist').default,
          meta: {
            title: '注册'
          }
        },
        {
          path: 'bindBank',
          name: 'bindBank',
          component: require('@/view/regist/bindBank').default,
          meta: {
            title: '绑定银行卡'
          }
        },
        {
          path: 'registState',
          name: 'registState',
          component: require('@/view/regist/result').default,
          meta: {
            title: '注册结果'
          }
        },
        {
          path: 'goods',
          name: 'goods',
          component: require('@/view/goods/index').default,
          meta: {
            title: '订单'
          }
        },
        {
          path: 'goodsState',
          name: 'goodsState',
          component: require('@/view/goods/result').default,
          meta: {
            title: '订单状态'
          }
        },
        {
          path: 'payment',
          name: 'payment',
          component: require('@/view/payment/index').default,
          meta: {
            title: '交易'
          }
        },
        {
          path: 'paymentState',
          name: 'paymentState',
          component: require('@/view/payment/result').default,
          meta: {
            title: '交易结果'
          }
        },
        {
          path: 'test',
          name: 'test',
          component: require('@/view/test/test').default,
          meta: {
            title: '测试页面'
          }
        }
      ]
    }
  ]
})
