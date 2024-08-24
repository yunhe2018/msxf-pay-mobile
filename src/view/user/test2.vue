<template>
    <div>
      <header>
        <div class="header">
            <span class="goback" @click="goback"><img src="@/assets/facePayMobile/images/goback.png" /></span>
            个人中心
        </div>
      </header>
      <div class="main">
          <div class="personWrap">
            <div class="imgWrap">
                <img :src="userImg===''?defaultImg:baseUrl+userImg" />
            </div>
            <div class="infoWrap">
              <span class="name">{{userName}}</span>
              <span class="tel">{{`手机号:${mobile}`}}</span>
            </div>
          </div>
          <div class="bankWrap">
            <div class="imgWrap" v-if="cardNo !== ''" >
              <svg class="icon svg-icon" aria-hidden="true">`
                  <use :xlink:href="cardType"></use>
              </svg>
            </div>
            <span class="name">{{cardNo !== ''?cardBankName+ ' ' + _cardNo:'暂未绑定的银行卡'}}</span>
            <button v-if="cardNo !== ''" @click="unbindCard">解除绑定</button>
            <button v-else @click="bindCard">绑定银行卡</button>
          </div>
          <div class="resetPsdWrap" @click="resetPsd">
            修改密码
            <span class="resetPsd">
                <img src="@/assets/facePayMobile/images/arrow.png" />
            </span>
          </div>
      </div>
    </div>
  </template>
<script>
import { getMember, unbindCard } from '@/request/regist/index.js'
import global from '@/config/global'
import defaultImg from '@/assets/facePayMobile/images/user_default.png'
import { bankCardAttribution } from '@/lib/bank.js'
import { getFormData } from '@/lib/util.js'

export default {
  data () {
    return {
      memberId: '',
      baseUrl: global.apiPrefix,
      mobile: '',
      userName: '',
      cardId: '',
      cardBankName: '',
      cardType: '',
      cardNo: '',
      userImg: '',
      defaultImg: defaultImg
    }
  },
  computed: {
    _cardNo () {
      if (!this.cardNo || this.cardNo === '') {
        return ''
      } else {
        return this.cardNo.substring(0, 4) + '........' + this.cardNo.substring(this.cardNo.length - 4, this.cardNo.length)
      }
    }
  },
  methods: {
    unbindCard () {
      unbindCard(getFormData({
        cardId: this.cardId
      })).then(res => {
        if (res.success) {
          this.mobile = ''
          this.userName = ''
          this.userImg = ''
          this.cardNo = ''
          this.getMemberInfo()
        }
      })
    },
    bindCard () {
      this.$router.push({
        path: '/bindBank',
        query: {memberId: this.memberId}
      })
    },
    resetPsd () {
      this.$router.push({
        path: '/resetPsd'
      })
    },
    goback () {
      this.$router.go(-1)
    },
    getMemberInfo () {
      getMember().then(res => {
        if (res.success) {
          this.memberId = res.value.memberId
          this.mobile = res.value.mobile
          this.userName = res.value.userName
          this.userImg = res.value.userImg
          if (res.value.cardNo) {
            this.cardId = res.value.cardId
            this.cardBankName = res.value.cardBankName
            this.cardNo = res.value.cardNo
            this.cardType = '#icon-' + bankCardAttribution(res.value.cardNo).bankCode // '#icon-' + 'ICBC'
          }
        // sessionStorage.setItem('memberId', res.value.memberId) // 会员ID
        }
      })
    }
  },
  mounted () {
    this.getMemberInfo()
  }
}
</script>
<style lang="scss" scoped>
  .personWrap{
    margin-top: 10px;
    background-color: #fff;
    padding: 15px 15px 25px;
    display: flex;
    .imgWrap{
      width: 60px;
      height: 60px;
      border-radius: 60px;
      overflow: hidden;
      img{
        width:100%;
        height:100%;
      }
    }
    .infoWrap{
      margin: 8px 0 0 12.5px;
      .name{
        display: block;
        font-size: 16px;
      }
      .tel{
        margin-top: 1px;
        display:block;
        font-size: 12px;
        color:#8E94A7;
      }
    }
  }
  .bankWrap{
    position: relative;
    margin-top: 10px;
    background-color: #fff;
    padding: 0 15px;
    height: 55px;
    line-height: 55px;
    display: flex;
    .imgWrap{
      margin-right:11px;
      width: 25px;
      border-radius: 24px;
      svg{
        width:100%;
        height:100%;
      }
    }
    .name{
      font-size: 16px;
    }
    button{
      height: 25px;
      padding: 0 10px;
      line-height: 25px;
      border-radius: 25px;
      font-size: 12px;
      color: #fff;
      background-color: #497BEC;
      position: absolute;
      right: 15px;
      top: 15px;
      outline: none;
      border: none;
    }
  }
  .resetPsdWrap{
    position: relative;
    margin-top: 10px;
    background-color: #fff;
    padding: 0 15px;
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    .resetPsd{
      position: absolute;
      right: 15px;
      top: 20px;
    }
  }
</style>
