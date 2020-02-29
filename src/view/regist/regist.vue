<template>
    <div class="dev">
      <header>
        <div class="header">
            <span class="goback" @click="goback"><img src="@/assets/facePayMobile/images/goback.png" /></span>
            新用户注册
        </div>
      </header>
      <div class="main">
        <ul>
            <li class="personWrap">
              <form class="upImg">
                <label>
                  <input type="file" name="file" ref="upFile" id="upFile" value="" @change="uploadImg"/>
                  <div class="imgWrap">
                      <img :src="form.userImg===''?defaultImg:baseUrl+form.userImg" />
                  </div>
                  <span class="infoWrap" v-if="form.userImg==='' && !imgLoading">
                    点击此处上传头像
                  </span>
                  <span class="infoWrap" v-if="imgLoading">
                    <van-loading type="spinner" size="20px">
                      上传头像中...
                    </van-loading>
                  </span>
                </label>
              </form>
            </li>
            <li class="inputWrap">
              <input type="text" v-model="form.userName" placeholder="姓名"/>
            </li>
            <li class="inputWrap">
              <input type="text" v-model="form.mobile" placeholder="手机号"/>
            </li>
            <li class="inputWrap">
              <input type="text" v-model="form.verifyCode" placeholder="短信验证码"/>
              <span
                :class="['code',{'code_dis':codeState}]"
                @click="getTelCode">
                {{codeState?counts+'s重新获取':'获取验证码'}}
              </span>
            </li>
            <li class="inputWrap">
              <label>
                <input  :type="passwordType? 'password': 'text'" v-model="form.password" placeholder="输入6-16位数字字母组合"/>
              </label>
              <div class="psdImg">
                <span class="close" v-show="form.password !==''" @click="clear('password')"><img src="@/assets/facePayMobile/images/close.png" /></span>
                <span class="separate" v-show="form.password !==''">|</span>
                <span class="eye" @click="checkType('passwordType')">
                    <img src="@/assets/facePayMobile/images/eye_closed.png" v-if="passwordType"/>
                    <img src="@/assets/facePayMobile/images/eye_opened.png" v-else/>
                </span>
              </div>
            </li>
            <li class="inputWrap">
              <label>
                <input  :type="passwordConfirmType? 'password': 'text'" v-model="form.passwordConfirm" placeholder="请再次输入新密码"/>
              </label>
              <div class="psdImg">
                <span class="close" v-show="form.passwordConfirm !==''" @click="clear('passwordConfirm')"><img src="@/assets/facePayMobile/images/close.png" /></span>
                <span class="separate" v-show="form.passwordConfirm !==''">|</span>
                <span class="eye" @click="checkType('passwordConfirmType')">
                    <img src="@/assets/facePayMobile/images/eye_closed.png" v-if="passwordConfirmType"/>
                    <img src="@/assets/facePayMobile/images/eye_opened.png" v-else/>
                </span>
              </div>
            </li>
        </ul>
        <button
        :class="['subBtn', {'disabledBtn': btn_flg}]"
        :disabled = "btn_flg"
        @click= "submit"
        >提交</button>
      </div>
      <transition name="fade">
        <div class="toast" v-if="toastFlag">
          <span class="txt">{{toastMsg}}</span>
        </div>
      </transition>
    </div>
  </template>

<script>
import { getCode, uploadImg, register } from '@/request/regist/index.js'
import global from '@/config/global'
import defaultImg from '@/assets/facePayMobile/images/user_default.png'
import { getFormData } from '@/lib/util.js'
import { Loading } from 'vant'
export default {
  components: {
    [Loading.name]: Loading
  },
  data () {
    return {
      toastFlag: false,
      toastMsg: '',
      codeState: false,
      counts: 60,
      baseUrl: global.apiPrefix,
      defaultImg: defaultImg,
      passwordType: true,
      passwordConfirmType: true,
      checked: false,
      form: {
        userName: '',
        mobile: '',
        verifyCode: '',
        userImg: '',
        password: '',
        passwordConfirm: ''
      },
      submitFlag: false,
      popup_show: true,
      imgLoading: false
    }
  },
  computed: {
    btn_flg () {
      return this.form.userName === '' || this.form.mobile === '' || this.form.verifyCode === '' || this.form.userImg === '' || this.form.password === '' || this.form.passwordConfirm === '' || this.submitFlag
    }
  },
  methods: {
    showToast (msg) {
      this.toastMsg = msg
      this.toastFlag = true
      setTimeout(() => {
        this.toastFlag = false
      }, 2400)
    },
    clear (psd) {
      this.form[psd] = ''
    },
    checkType (type) {
      this[type] = !this[type]
    },
    getTelCode () {
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
    uploadImg () {
      var formData = new FormData()
      var file = this.$refs.upFile.files[0]
      if (file) {
        this.imgLoading = true
        formData.append('file', file)
        uploadImg(formData).then(res => {
          this.form.userImg = res.value
          if (res.code !== '1') {
            this.showToast(res.message)
          }
          this.imgLoading = false
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
      if (this.form.password !== this.form.passwordConfirm) {
        this.showToast('两次输入的密码不相同，请重新填写')
        return
      }
      const msg = this.codeValidate()
      if (msg !== undefined) {
        this.showToast(msg)
        return
      }
      this.submitFlag = true
      register(this.form).then(res => {
        this.submitFlag = false
        if (res.success) {
          this.$router.push({
            path: '/registState',
            query: {from: 'regist', state: 'succ', msg: '注册成功', memberId: res.value}
          })
        } else {
          this.showToast(`${res.message},请重新注册`)
        }
      }).catch(erro => {
        this.$router.push({
          path: '/registState',
          query: {from: 'regist', state: 'error', msg: '注册失败'}
        })
      })
    },
    codeValidate () {
      if (isNaN(this.form.verifyCode) || this.form.verifyCode.length !== 6) {
        return '验证码请填写6位数字'
      }
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
    goback () {
      this.$router.go(-1)
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
    margin:10px 0;
    padding:0 20px;
    background-color: #fff;
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
        font-size: 16px;
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
          height: 12px;
          line-height: 12px;
          margin-top: 4px;
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
    .personWrap{
      margin-top: 10px;
      background-color: #fff;
      padding: 15px 15px 15px 0;
      display: flex;
      form{
        width: 100%;
        label{
          display: flex;
          width: 100%;
          input{
            width: 0;
            height: 0;
            opacity: 0;
          }
          .imgWrap{
            width:60px;
            height:60px;
            border-radius: 60px;
            border-radius: 60px;
            overflow: hidden;
            img{
              width:100%;
              height:100%;
            }
          }
          .infoWrap{
            margin: 18px 0 0 12.5px;
            font-size: 18px;
            color: #C4C7D1;
          }
        }
      }
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
