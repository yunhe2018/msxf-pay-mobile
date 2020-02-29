<template>
  <div class="main">
    <header>
      <div class="header">
          <span class="goback" @click="goback"><img src="@/assets/facePayMobile/images/goback.png" /></span>
           {{msg}}
      </div>
    </header>
    <div v-if="from==='regist'">
      <img class="stateImg" :src="state==='succ'?succ_img:erro_img"/>
      <h2 class="stateName">{{msg}}</h2>
      <p class="stateTxt">{{state==='succ'?'恭喜您注册成功，可以继续绑定银行卡':'连接超时'}}</p>
      <button v-if="state==='succ'" class="stateBtn" @click="gologin">去登录</button>
      <button v-if="state==='succ'" class="stateBtn" @click="gobind">绑定银行卡</button>
      <button v-if="state==='error'" class="stateBtn" @click="goregist">重新注册</button>
    </div>
    <div v-if="from==='bind'">
      <img class="stateImg" :src="state==='succ'?succ_img:erro_img"/>
      <h2 class="stateName">{{msg}}</h2>
      <p class="stateTxt">{{state==='succ'?'恭喜您可以使用马上金融刷脸支付功能':'连接超时'}}</p>
      <button v-if="state==='succ'" class="stateBtn" @click="gologin">去登录</button>
      <button v-if="state==='error'" class="stateBtn" @click="gobind">重新绑定银行卡</button>
    </div>
  </div>
</template>
<script>
import succImg from '@/assets/facePayMobile/images/succ.png'
import erroImg from '@/assets/facePayMobile/images/erro.png'
export default {
  data () {
    return {
      from: '',
      state: '',
      msg: '',
      memberId: '', // 注册跳转到绑定银行卡页面时候用
      succ_img: succImg,
      erro_img: erroImg
    }
  },
  methods: {
    gologin () {
      this.$router.push({
        path: '/login'
      })
    },
    goregist () {
      this.$router.push({
        path: '/regist'
      })
    },
    gobind () {
      this.$router.push({
        path: '/bindBank',
        query: {memberId: this.memberId}
      })
    },
    goback () {
      this.$router.go(-1)
    }
  },
  created () {
    this.from = this.$route.query.from
    this.state = this.$route.query.state
    this.msg = this.$route.query.msg
    this.memberId = this.$route.query.memberId ? this.$route.query.memberId : ''
  }
}
</script>
<style lang="scss" scoped>
  .main{
    height: 100%;
    background-color: #fff;
  }
  .stateImg{
    display:block;
    width:105px;
    margin:60px auto 0;
  }
  .stateName{
    font-size: 18px;
    text-align: center;
    margin: 10px 0;
  }
  .stateTxt{
    font-size: 14px;
    color:#8F94A7;
    text-align: center;
  }
  .stateBtn{
    display:block;
    outline: none;
    border: none;
    color: #fff;
    background-color: #497BEC;
    width: 170px;
    height: 46px;
    border-radius: 46px;
    line-height: 46px;
    text-align: center;
    margin: 30px auto 0;
    font-size: 18px;
  }
</style>
