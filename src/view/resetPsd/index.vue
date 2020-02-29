<template>
  <div>
    <header>
      <div class="header">
          <span class="goback" @click="goback"><img src="@/assets/facePayMobile/images/goback.png" /></span>
          修改密码
      </div>
    </header>
    <div class="main">
      <ul>
          <li class="inputWrap">
            <label>
              <span class="name">旧密码</span>
              <input  :type="oldPsdType? 'password': 'text'" v-model="form.oldPassword" placeholder="请输入旧密码"/>
            </label>
            <div class="psdImg">
              <span class="close" v-show="form.oldPassword !==''" @click="clear('oldPassword')"><img src="@/assets/facePayMobile/images/close.png" /></span>
              <span class="separate" v-show="form.oldPassword !==''">|</span>
              <span class="eye" @click="checkType('oldPsdType')">
                  <img src="@/assets/facePayMobile/images/eye_closed.png" v-if="oldPsdType"/>
                  <img src="@/assets/facePayMobile/images/eye_opened.png" v-else/>
              </span>
            </div>
          </li>
          <li class="inputWrap">
            <label>
              <span class="name">新密码</span>
              <input  :type="newPsdType? 'password': 'text'" v-model="form.newPassword" placeholder="请输入新密码"/>
            </label>
            <div class="psdImg">
              <span class="close" v-show="form.newPassword !==''" @click="clear('newPassword')"><img src="@/assets/facePayMobile/images/close.png" /></span>
              <span class="separate" v-show="form.newPassword !==''">|</span>
              <span class="eye" @click="checkType('newPsdType')">
                  <img src="@/assets/facePayMobile/images/eye_closed.png" v-if="newPsdType"/>
                  <img src="@/assets/facePayMobile/images/eye_opened.png" v-else/>
              </span>
            </div>
          </li>
      </ul>
    </div>
    <button
    :class="['subBtn', {'disabledBtn': btnFlag}]"
    :disabled = "btnFlag"
    @click= "submit"
    >保存</button>
    <transition name="fade">
      <div class="toast" v-if="toastFlag">
        <span class="txt">{{toastMsg}}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { updatePsd } from '@/request/regist/index.js'
export default {
  data () {
    return {
      toastFlag: false,
      toastMsg: '',
      oldPsdType: true,
      newPsdType: true,
      form: {
        oldPassword: '',
        newPassword: '' // passwordConfirm
      },
      submitFlag: false
    }
  },
  computed: {
    btnFlag () {
      return this.form.oldPassword === '' || this.form.newPassword === '' || this.submitFlag
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
    clear (psd) {
      this.form[psd] = ''
    },
    checkType (type) {
      this[type] = !this[type]
    },
    submit () {
      if (!this.checkPwd(this.form.newPassword)) {
        this.showToast('密码请输入6-16位数字字母组合')
        return
      }
      this.submitFlag = true
      updatePsd({
        oldPassword: this.form.oldPassword,
        newPassword: this.form.newPassword,
        passwordConfirm: this.form.newPassword
      }).then(res => {
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
  }
}
</script>

<style lang="scss" scoped>
  .main{
    padding:0px 20px 0;
    margin-top: 10px;
    background-color: #fff;
    .inputWrap{
      height: 56px;
      line-height: 56px;
      position: relative;
      padding-bottom: 1px;
      border-bottom: 1px solid #E7E8EB;
      .name{
        font-size: 16px;
        padding-right: 50px;
      }
      input{
        width: 50%;
        font-size: 18px;
        outLine: none;
        border: none;
      }
      .psdImg{
        position: absolute;
        right: 0;
        top: 20.5px;
        display: flex;
        .close{
          width: 20px;
          height: 20px;
          img{width: 100%;}
        }
        .separate{
          color: #E7E8EB;
          padding: 0 7px;
          height: 12px;
          line-height: 12px;
          margin-top: 2px;
        }
        .eye{
          width: 20px;
          height: 20px;
          img{width: 100%;}
        }
      }
    }
    .inputWrap:last-child{
      border-bottom: none
    }
  }
  .subBtn{
    display: block;
    width: 335px;
    height:46px;
    border-radius: 46px;
    color: #fff;
    text-align: center;
    font-size: 18px;
    line-height: 46px;
    margin: 86px auto;
    background-color: #497BEC;
    outline: none;
    border: none;
  }
  .disabledBtn{
    opacity: 0.4;
  }
</style>
