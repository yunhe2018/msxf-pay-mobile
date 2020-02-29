<template>
  <div class="dev">
    <header>
      <div class="header">
          <span class="operation" @click="goRegist">注册</span>
      </div>
    </header>
    <div class="main">
      <h1>账号登录</h1>
      <ul>
          <li class="inputWrap">
            <input type="text" v-model="form.mobile" placeholder="手机号/账号"/>
          </li>
          <li class="inputWrap">
            <input  :type="psdType? 'password': 'text'" v-model="form.password" placeholder="密码"/>
            <div class="psdImg">
              <span class="close" v-show="form.password !==''" @click="clear"><img src="@/assets/facePayMobile/images/close.png" /></span>
              <span class="separate" v-show="form.password !==''">|</span>
              <span class="eye" @click='checkType'>
                  <img src="@/assets/facePayMobile/images/eye_closed.png" v-if="psdType"/>
                  <img src="@/assets/facePayMobile/images/eye_opened.png" v-else/>
              </span>
            </div>
          </li>
      </ul>
      <div class="forgetPsd" @click="goResetPsd">忘记密码</div>
      <button
      :class="['subBtn', {'disabledBtn': btnFlag}]"
      :disabled = "btnFlag"
      @click= "submit"
      >登录</button>
    </div>
    <transition name="fade">
      <div class="toast" v-if="toastFlag">
        <span class="txt">{{toastMsg}}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { loginUser } from '@/request/regist/index.js'
export default {
  data () {
    return {
      toastFlag: false,
      toastMsg: '',
      psdType: true,
      form: {
        mobile: '',
        password: ''
      },
      submitFlag: false
    }
  },
  computed: {
    btnFlag () {
      return this.form.password === '' || this.form.mobile === '' || this.submitFlag
    }
  },
  methods: {
    showToast (msg) {
      this.toastMsg = msg
      this.toastFlag = true
      setTimeout(() => {
        this.toastFlag = false
      }, 2000)
    },
    clear () {
      this.form.password = ''
    },
    checkType () {
      this.psdType = !this.psdType
    },
    submit () {
      this.submitFlag = true
      loginUser({
        mobile: this.form.mobile,
        password: this.form.password
      }).then(res => {
        this.submitFlag = false
        if (!res.success) {
          this.showToast(res.message)
          return
        }
        sessionStorage.setItem('sessionId', res.value.sessionId) // 登录token
        // sessionStorage.setItem('merchantId', res.value.regMerchantId) // 商户ID
        this.$router.push({
          path: '/user'
        })
      }).catch(error => {
        console.log(error)
        this.showToast('登录失败')
        this.submitFlag = false
      })
    },
    goRegist () {
      this.$router.push('/regist')
    },
    goResetPsd () {
      this.$router.push('/forgetPsd')
    }
  }
}
</script>

<style lang="scss" scoped>
  .dev{
    height: 100%;
    background-color: #fff;
  }
  .main{
    margin:0 20px;
    h1{
      font-size: 24px;
      margin: 24px 0 10px 0;
      font-weight: normal;
    }
    .inputWrap{
      position: relative;
      padding-top: 25px;
      padding-bottom: 1px;
      border-bottom: 1px solid #E7E8EB;
      input {
        font-size: 18px;
        height: 45px;
        width: 80%;
        line-height: 45px;
        outLine: none;
        border: none;
      }
      .psdImg{
        position: absolute;
        right: 0;
        top: 40px;
        display: flex;
        .close{
          width: 20px;
          height: 20px;
          img{width: 100%;}
        }
        .separate{
          color: #E7E8EB;
          padding: 0 7px;
          margin-top: 2.5px;
        }
        .eye{
          width: 20px;
          height: 20px;
          img{width: 100%;}
        }
      }
    }
    .forgetPsd{
      font-size: 14px;
      padding-top: 12px;
    }
    .subBtn{
      width: 335px;
      height:46px;
      border-radius: 46px;
      color: #fff;
      text-align: center;
      font-size: 18px;
      line-height: 46px;
      margin: 30px auto;
      background-color: #497BEC;
      outline: none;
      border: none;
    }
    .disabledBtn{
      opacity: 0.4;
    }
  }
</style>
