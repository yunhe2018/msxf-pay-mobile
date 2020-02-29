<template>
  <div class="dev">
    <header>
      <div class="header">
          <span class="goback" @click="goback"><img src="@/assets/facePayMobile/images/goback.png" /></span>
          找回密码
      </div>
    </header>
    <div class="main">
      <ul>
          <li class="inputWrap">
            <input type="text" v-model="form.mobile" placeholder="手机号"/>
          </li>
          <li class="inputWrap">
            <input type="text" v-model="form.verifyCode" placeholder="短信验证码"/>
            <span
              :class="['code',{'code_dis':codeState}]"
              @click="getCode">
              {{codeState?counts+'s重新获取':'获取验证码'}}
            </span>
          </li>
          <li class="inputWrap">
            <input  :type="psdType? 'password': 'text'" v-model="form.password" placeholder="请输入新密码"/>
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
      <button
      :class="['subBtn', {'disabledBtn': btnFlag}]"
      :disabled = "btnFlag"
      @click= "submit"
      >保存</button>
    </div>
    <transition name="fade">
      <div class="toast" v-if="toastFlag">
        <span class="txt">{{toastMsg}}</span>
      </div>
    </transition>
  </div>
</template>

<script>
// import { bankCardAttribution } from '@/lib/bank.js'
import { getCode, forgetPsd } from '@/request/regist/index.js'
import { getFormData } from '@/lib/util.js'

export default {
  data () {
    return {
      toastFlag: false,
      toastMsg: '',
      psdType: true,
      codeState: false,
      counts: 60,
      form: {
        mobile: '',
        verifyCode: '',
        password: '' // passwordConfirm
      },
      submitFlag: false
    }
  },
  computed: {
    btnFlag () {
      return this.form.mobile === '' || this.form.password === '' || this.form.verifyCode === '' || this.submitFlag
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
    checkPwd (pwd) {
      var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      var re = new RegExp(reg)
      if (re.test(pwd)) {
        return true
      } else {
        return false
      }
    },
    clear () {
      this.form.password = ''
    },
    checkType () {
      this.psdType = !this.psdType
    },
    getCode () {
      if (isNaN(this.form.mobile) || this.form.mobile.length !== 11) {
        this.showToast('手机号请填写11位数字')
        return
      }
      if (!this.codeState) {
        this.settime()
        getCode(getFormData({
          mobile: this.form.mobile
        })).then(res => {

        })
      }
    },
    settime () {
      this.codeState = true
      setTimeout(() => {
        if (this.counts === 0) {
          this.counts = 60
          this.codeState = false
          return false
        }
        this.counts = this.counts - 1
        this.settime()
      }, 1000)
    },
    submit () {
      if (!this.checkPwd(this.form.password)) {
        this.showToast('密码请输入6-16位数字字母组合')
        return
      }
      this.submitFlag = true
      forgetPsd(getFormData({
        mobile: this.form.mobile,
        verifyCode: this.form.verifyCode,
        password: this.form.password,
        passwordConfirm: this.form.password
      })).then(res => {
        this.submitFlag = false
        if (res.success) {
          this.showToast(res.message)
          setTimeout(() => {
            this.$router.push({
              path: '/login'
            })
          }, 800)
        } else {
          this.showToast(res.message)
        }
      })
    },
    goback () {
      this.$router.go(-1)
    }
  },
  created () {

  }
}
</script>

<style lang="scss" scoped>
  .dev{
    height: 100%;
    background-color: #fff;
  }
  .main{
    margin:10px 20px;
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
        line-height: 45px;
        width: 80%;
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
          margin-top: 2px;
        }
        .eye{
          width: 20px;
          height: 20px;
          img{width: 100%;}
        }
      }
      .code{
        font-size: 14px;
        color: #497BEC;
        position: absolute;
        right: 0;
        top: 40px;
      }
      .code_dis{
        color: #C4C7D1;
      }
    }
    .subBtn{
      width: 335px;
      height: 46px;
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
