<template>
  <div>
    <header>
      <div class="header">
          <span class="goback" @click="goback"><img src="@/assets/facePayMobile/images/goback.png" /></span>
          绑定银行卡
      </div>
    </header>
    <div class="main">
      <ul>
          <li class="inputWrap">
            <label>
              <span class="name">开户行</span>
              <input type="text" readonly v-model="cardBankName" @click="showPopup('bank_show')" placeholder="请选择开户行"/>
            </label>
          </li>
          <li class="inputWrap">
            <label>
              <span class="name">银行卡类型</span>
              <input type="text" readonly v-model="cardTypeName" @click="showPopup('cardType_show')" placeholder="请选择银行卡类型"/>
            </label>
          </li>
          <li class="inputWrap">
            <label>
              <span class="name">持卡人</span>
              <input type="text" v-model="form.cardOwnerName" placeholder="请输入姓名"/>
            </label>
          </li>
          <li class="inputWrap">
            <label>
              <span class="name">卡号</span>
              <input type="text" v-model="form.cardNo" placeholder="请输入卡号" @blur="bankValid"/>
            </label>
          </li>
          <li class="inputWrap" v-if="form.cardType === 'C'">
            <label>
              <span class="name">CVV2校验码</span>
              <input type="text" v-model="cvv2" placeholder="请输入校验码" @blur="cvv2Valid"/>
            </label>
          </li>
          <li class="inputWrap" v-if="form.cardType === 'C'">
            <label>
              <span class="name">有效期</span>
              <input type="text" readonly v-model="validDate" @click="showPopup('date_show')" placeholder="请选择有效期"/>
            </label>
          </li>
          <li class="inputWrap">
            <label>
              <span class="name">证件类型</span>
              <input type="text" readonly v-model="certTypeName" @click="showPopup('certType_show')" placeholder="请选择证件类型"/>
            </label>
          </li>
          <li class="inputWrap">
            <label>
              <span class="name">证件号码</span>
              <input type="text" v-model="form.certNo" placeholder="请输入证件号码" @blur="IDValid"/>
            </label>
          </li>
          <li class="inputWrap">
            <label>
              <span class="name">手机号码</span>
              <input type="text" v-model="form.cardMobile" placeholder="请输入银行预留手机号"/>
            </label>
          </li>
          <li class="inputWrap">
            <label>
              <span class="name">验证码</span>
              <input type="text" v-model="cardMobileVerifyCode" placeholder="短信验证码"/>
              <span
                :class="['code',{'code_dis':codeState}]"
                @click="getCode">
                {{codeState?counts+'s重新获取':'获取验证码'}}
              </span>
            </label>
          </li>
      </ul>
    </div>
    <div class="agreement">
      <label class="checkBox">
          <img src="@/assets/facePayMobile/images/checked.png" v-if="checked" />
          <img src="@/assets/facePayMobile/images/unChecked.png" v-else/>
        <input type="checkbox" v-model="checked"/>
      </label>
      <span>我已阅读并同意</span>
      <a class="link" @click='showConceal'>《隐私政策》、</a>
      <a class="link" @click='showUserAgreement'>《用户注册协议》</a>
    </div>
    <!--选择器-->
    <van-popup v-model="popup_show" position="bottom">
      <!--开户行-->
      <van-picker v-show="bank_show" :columns="bink_columns" @change="bankChange" />
      <!--银行卡类型-->
      <van-picker v-show="cardType_show" :columns="cardType_columns" @change="bankTypeChange"/>
      <!--有效期-->
      <van-datetime-picker v-show="date_show" v-model="currentDate" @change="dateChange"
      type="year-month" :min-date="minDate" :max-date="maxDate" :show-toolbar="false"/>
      <!--证件类型-->
      <van-picker v-show="certType_show" :columns="certType_columns" @change="certTypeChange" />
    </van-popup>
    <button :class="['subBtn', {'disabledBtn': !btn_flg}]" :disabled = "!btn_flg" @click= "submit" >提交</button>
    <transition name="fade">
      <div class="toast" v-if="toastFlag">
        <span class="txt">{{toastMsg}}</span>
      </div>
    </transition>
    <!--用户协议-->
    <agreements ref="userAgreement"/>
    <!--隐私政策-->
    <conceal ref="conceal"/>
  </div>
</template>

<script>
import { bindCard, addBindCard, sysDict } from '@/request/regist/index.js'
import { DatetimePicker, Popup, Picker } from 'vant'
import { getFormData } from '@/lib/util.js'
import agreements from './components/agreements.vue'
import conceal from './components/conceal.vue'

export default {
  components: {
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [DatetimePicker.name]: DatetimePicker,
    agreements,
    conceal
  },
  data () {
    return {
      popup_show: false,
      bank_show: false,
      cardType_show: false,
      date_show: false,
      certType_show: false,
      toastFlag: false,
      toastMsg: '',
      oldPsdType: true,
      newPsdType: true,
      codeState: false,
      checked: false,
      counts: 60,
      binkList: [], // 银行对象集合
      certTypeList: [], // 证件类型对象集合
      bink_columns: [], // 银行options
      cardType_columns: [], // 银行卡类型options
      certType_columns: [], // 证件类型options
      minDate: new Date(),
      maxDate: new Date(2030, 11),
      currentDate: '',
      cardBankName: '',
      cardTypeName: '',
      certTypeName: '', // 证件类型name
      cvv2: '', // cvv2校验码
      validDate: '', // 'YYMM'
      form: {
        memberId: '',
        cardBank: '', // 开卡银行
        cardType: '', // 银行卡类型
        cardOwnerName: '', // 银行卡持卡人姓名
        cardNo: '', // 卡号
        certType: '', // 证件类型
        certNo: '', // 证件号
        cardMobile: '' // 银行卡绑定的手机号
      },
      submitFlag: false,
      payOrderNo: '', // 签约订单号,由bindcard接口返回
      cardMobileVerifyCode: '' // 银行验证码
    }
  },
  computed: {
    btn_flg () {
      const baseFlag = this.checked &&
        this.form.cardBank !== '' &&
        this.form.cardType !== '' &&
        this.form.cardOwnerName !== '' &&
        this.form.cardNo !== '' &&
        this.form.certType !== '' &&
        this.form.certNo !== '' &&
        this.form.cardMobile !== '' &&
        this.cardMobileVerifyCode !== '' &&
        !this.submitFlag
      if (this.form.cardType === '') {
        return false
      } else if (this.form.cardType === 'D') {
        return baseFlag
      } else if (this.form.cardType === 'C') {
        return baseFlag &&
        this.cvv2 !== '' &&
        this.validDate !== ''
      }
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
    mobileValidate () {
      if (isNaN(this.form.cardMobile) || this.form.cardMobile.length !== 11) {
        return '请填写11位手机号'
      }
    },
    cvv2Validate () {
      if (isNaN(this.cvv2) || this.cvv2.length !== 3) {
        return 'CVV2码请填写3位数字'
      }
    },
    certNoValidate () { // 证件号码校验，目前只有身份证；1、身份证件。居民身份证、出生证、护照等; 2、工作证件。警官证、执行公务证; 3、其他证件:学生证、毕业证...
      const a = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (this.form.certType === 'certType:1' && !a.test(this.form.certNo)) { // certType:1 — — 身份证
        return '请填写18位身份证号'
      }
    },
    getBankBin (cardNo) {
      var errMsg = ''
      if (isNaN(cardNo)) {
        cardNo = parseInt(cardNo)
        if (isNaN(cardNo)) {
          // errMsg = cardNo + ':银行卡号必须是数字'
          errMsg = '银行卡号必须是数字'
          return errMsg
        }
      }
      if (cardNo.toString().length < 15 || cardNo.toString().length > 19) {
        // errMsg = cardNo + ':银行卡位数必须是15到19位'
        errMsg = '银行卡位数必须是15到19位'
        return errMsg
      }
    },
    IDValid () {
      const msg = this.certNoValidate()
      if (this.certNoValidate() !== undefined) {
        this.showToast(msg)
      }
    },
    cvv2Valid () {
      const msg = this.cvv2Validate()
      if (msg !== undefined) {
        this.showToast(msg)
      }
    },
    getCode () {
      // 校验
      const IDmsg = this.certNoValidate()
      const cvv2msg = this.cvv2Validate()
      const mobilemsg = this.mobileValidate()
      const bankmsg = this.getBankBin(this.form.cardNo)
      if (this.cardBankName === '') {
        this.showToast('请选择开户行')
        return false
      } else if (this.cardTypeName === '') {
        this.showToast('请选择银行卡类型')
        return false
      } else if (this.form.cardOwnerName === '') {
        this.showToast('请填写持卡人姓名')
        return false
      } else if (this.certTypeName === '') {
        this.showToast('请选择证件类型')
        return false
      } else if (bankmsg !== undefined) {
        this.showToast(bankmsg)
        return false
      } else if (IDmsg !== undefined) {
        this.showToast(IDmsg)
        return false
      } else if (mobilemsg !== undefined) {
        this.showToast(mobilemsg)
        return false
      }
      if (this.form.cardType === 'C' && cvv2msg !== undefined) {
        this.showToast(cvv2msg)
        return false
      }
      if (this.form.cardType === 'C' && this.validDate === '') {
        this.showToast('请选择有效期')
        return false
      }

      this.settime()
      let data = this.form
      if (this.form.cardType === 'C') { // 信用卡类型
        data = {
          ...this.form,
          cvv2: this.cvv2,
          validDate: this.validDate.substring(2, 4) + this.validDate.substring(5, 7)
        }
      }
      bindCard(data).then(res => {
        if (res.success) {
          this.payOrderNo = res.value
        } else {
          this.showToast(`${res.message},请重新绑定银行卡`)
        }
      }).catch(erro => {
        this.showToast(`${erro.message}`)
      })
    },
    submit () {
      // 提交
      this.submitFlag = true
      let data = {
        memberId: this.form.memberId,
        payOrderNo: this.payOrderNo,
        cardMobileVerifyCode: this.cardMobileVerifyCode
      }
      addBindCard(getFormData(data)).then(res => {
        this.submitFlag = false
        if (res.success) {
          this.$router.push({
            path: '/registState',
            query: {from: 'bind', state: 'succ', msg: '绑定银行卡成功', memberId: res.value}
          })
        } else {
          this.showToast(`${res.message},请重新绑定银行卡`)
        }
      }).catch(erro => {
        this.$router.push({
          path: '/registState',
          query: {from: 'bind', state: 'error', msg: '绑定银行卡失败'}
        })
      })
    },
    bankValid () {
      const msg = this.getBankBin(this.form.cardNo)
      if (msg !== undefined) {
        this.showToast(msg)
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
    showPopup (type) {
      this.popup_show = true
      this.bank_show = false
      this.cardType_show = false
      this.date_show = false
      this.certType_show = false
      this[type] = true
      // 初始化值为第一个选项值
      if (type === 'bank_show' && this.cardBankName === '') {
        this.cardBankName = this.binkList[0].dictName
        this.form.cardBank = this.binkList[0].dictCode
      } else if (type === 'cardType_show' && this.cardTypeName === '') {
        this.cardTypeName = '借记卡'
        this.form.cardType = 'D'
      } else if (type === 'date_show' && this.validDate === '') {
        this.validDate = new Date().getFullYear() + '-' + (new Date().getMonth() > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1))
        // this.validDate = new Date().getFullYear().toString().substring(2, 4) + (new Date().getMonth() > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1))
      } else if (type === 'certType_show' && this.certTypeName === '') {
        this.certTypeName = this.certTypeList[0].dictName
        this.form.certType = this.certTypeList[0].dictCode
      }
    },
    bankChange (picker, value, index) {
      const i = index
      this.cardBankName = value
      this.form.cardBank = this.binkList[i].dictCode
    },
    bankTypeChange (picker, value, index) {
      this.cardTypeName = value
      this.form.cardType = value === '借记卡' ? 'D' : 'C'
    },
    dateChange (value) {
      this.validDate = value.getColumnValue(0) + '-' + value.getColumnValue(1)
      // this.validDate = value.getColumnValue(0).toString().substring(2, 4) + value.getColumnValue(1)
    },
    certTypeChange (picker, value, index) {
      const i = index
      this.certTypeName = value
      this.form.certType = this.certTypeList[i].dictCode
    },
    goback () {
      this.$router.go(-1)
    },
    showUserAgreement () {
      this.$refs.userAgreement.showData()
    },
    showConceal () {
      this.$refs.conceal.showData()
    }
  },
  mounted () {
    this.form.memberId = this.$route.query.memberId
    this.cardType_columns = ['借记卡', '信用卡'] // 'D':借记卡, 'C'：信用卡
    sysDict(getFormData({
      parentCode: 'cardBank'
    })).then(res => {
      if (res.success) {
        this.binkList = res.value
        this.bink_columns = res.value.map(i => i.dictName) // bank
      }
    })
    sysDict(getFormData({
      parentCode: 'certType'
    })).then(res => {
      if (res.success) {
        this.certTypeList = res.value
        this.certType_columns = res.value.map(i => i.dictName) // 证件类型（目前只有身份证）
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .main{
    padding:0px 20px 0;
    margin-top: 10px;
    background-color: #fff;
    .inputWrap{
      // height: 56px;
      // line-height: 56px;
      position: relative;
      padding-bottom: 1px;
      border-bottom: 1px solid #E7E8EB;
      label{
        display: flex;
        height: 100%;
      }
      .name{
        display: inline-block;
        width: 100px;
        height: 56px;
        line-height: 56px;
        font-size: 16px;
        /* padding-right: 30px; */
      }
      .inputSpan{
        display: inline-block;
        height: 100%;
        width:50%;
      }
      input,select{
        display: inline-block;
        height: 56px;
        line-height: 56px;
        width: 53%;
        font-size: 18px;
        outLine: none;
        border: none;
      }
      .code{
        font-size: 14px;
        color: #497BEC;
        position: absolute;
        right: 0;
        top: 20px;
      }
      .code_dis{
        color: #C4C7D1;
      }
    }
    .inputWrap:last-child{
      border-bottom: none
    }
  }
  .agreement{
    padding:0px 20px 0;
    margin-top: 30px;
    /* display: flex; */
    /* flex-wrap: wrap; */
    font-size: 12px;
    line-height: 23px;
    color: #999;
    .checkBox{
      /* display:inline-block; */
      float: left;
      margin: 3.5px 8px 0 0;
      width: 15px;
      height:15px;
      img{
        width:100%;
        height:100%;
      }
      input{
        opacity: 0;
        width: 0;
        height:0;
        line-height:0;
      }
    }
    .link{
      color: #497BEC;
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
    margin: 20px auto;
    background-color: #497BEC;
    outline: none;
    border: none;
  }
  .disabledBtn{
    opacity: 0.4;
  }
</style>
