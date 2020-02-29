<template>
  <div class="dev">
    <header>
      <div class="header">
          <span class="goback" @click="goBack"><img src="@/assets/facePayMobile/images/goback.png" /></span>
          确认交易
      </div>
    </header>
    <div class="main">
      <div class="paymentDetail">
        <h3>马上商城订单</h3>
        <b>￥{{totalMoney}}</b>
        <p>收款方<span>马上商城平台商户</span></p>
        <button class="subBtn" @click= "openPayDialog" >立即支付</button>
      </div>
    </div>

    <div class="mask" v-show="showPayDialog">
      <div class="payDialogWrap">
        <div class="payDialog">
          <h4><img src="@/assets/facePayMobile/images/close.png" @click= "closePayDialog" /><span>请输入支付密码</span></h4>
          <h5>马上商城订单</h5>
          <b>￥{{totalMoney}}</b>
          <p>收款方<span>招商銀行儲蓄卡</span></p>
          <div class="psdWrap">
            <!-- <input type="tel" maxlength="6" /> -->
            <ul @click="showNumBox">
              <li v-for="(item, index) in 6" :key="index"><span v-if="index < psd_payment.length"></span></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- <div class="numWrap">
        <ul>
            <li :class="{notNum: item === ''}" v-for="(item, index) in num" :key="index" @click="inputNum(item)">{{item}}</li>
            <li class="notNum"><img src="@/assets/facePayMobile/images/tuihui.png" @click="numBack"/></li>
        </ul>
      </div> -->
      <transition name="fade02">
        <div class="numWrap" v-if='numFlag'>
        <div class="downWrap" @click="checkNumFade"><img src="@/assets/facePayMobile/images/down.png" /></div>
          <ul>
              <li :class="{notNum: item === ''}" v-for="(item, index) in num" :key="index" @click="inputNum(item)">{{item}}</li>
              <li class="notNum"><img src="@/assets/facePayMobile/images/tuihui.png" @click="numBack"/></li>
          </ul>
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div class="toast" v-if="toastFlag">
        <span class="txt">{{toastMsg}}</span>
      </div>
    </transition>

  </div>
</template>

<script>
import { appOrder } from '@/request/regist/index.js'
export default {
  data () {
    return {
      numFlag: false,
      orderNo: '',
      totalMoney: '',
      toastFlag: false,
      toastMsg: '',
      showPayDialog: false,
      psd_payment: '',
      num: [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0]
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
    openPayDialog () {
      this.psd_payment = ''
      this.showPayDialog = true
    },
    closePayDialog () {
      this.showPayDialog = false
    },
    inputNum (num) {
      if (num !== '') {
        this.psd_payment = this.psd_payment += num
      }
    },
    numBack () {
      if (this.psd_payment !== '') {
        this.psd_payment = this.psd_payment.substring(0, this.psd_payment.length - 1)
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    checkNumFade () {
      this.numFlag = false
    },
    showNumBox () {
      this.numFlag = true
    }
  },
  watch: {
    psd_payment (val) {
      if (val.length === 6) {
        appOrder({
          orderNo: this.orderNo
        }).then(res => {
          this.$router.push({
            path: '/paymentState',
            query: {state: res.code === '1' ? 'succ' : 'erro'}
          })
          this.showToast(res.message)
        })
      }
    }
  },
  mounted () {
    if (this.$route.query) {
      this.orderNo = this.$route.query.orderNo
      this.totalMoney = this.$route.query.totalMoney
    }
    this.numFlag = true
  }
}
</script>

<style lang="scss" scoped>
  .dev{
    height: 100%;
    background-color: #f7f7f7;
  }
  .main{
    /* margin:0 40px; */
    .paymentDetail{
      h3{
        color:#222;
        font-size: 14px;
        line-height: 15px;
        padding: 15px 0 0px 0;
        text-align: center;
        font-weight: normal;
      }
      b{
        display: block;
        color:#222;
        font-size: 37px;
        line-height: 37px;
        text-align: center;
        padding: 0 0 7px 0;
      }
      p{
        height: 40px;
        line-height: 40px;
        color: #999;
        font-size: 12px;
        background-color: #fff;
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        padding: 0 10px 0;
        overflow: hidden;
        span{
          color:#222;
          float: right;
        }
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
      margin: 30px auto;
      background-color: #497BEC;
      outline: none;
      border: none;
    }
  }
  .mask{
    position: fixed;
    z-index: 99;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    .payDialogWrap{
      padding: 20px;
      box-sizing: border-box;
      .payDialog{
        background-color: #fff;
        padding: 13px;
        border-radius: 5px;
        h4{
          font-weight: normal;
          text-align: center;
          position: relative;
          font-size: 15px;
          line-height: 23px;
          img{
            width:23px;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
        h5{
          color:#222;
          font-size: 15px;
          line-height: 15px;
          padding: 22.5px 0 13px 0;
          text-align: center;
          font-weight: normal;
        }
        b{
          display: block;
          color:#222;
          font-size: 37px;
          line-height: 37px;
          text-align: center;
          padding: 0 0 24px 0;
        }
        p{
          height: 42px;
          line-height: 42px;
          color: #999;
          font-size: 13px;
          background-color: #fff;
          border-top: 1px solid #e5e5e5;
          overflow: hidden;
          span{
            /* color:#222; */
            float: right;
          }
        }
        .psdWrap{
          ul{
            border: 1px solid #e5e5e5;
            display: flex;
            li{
              border-right: 1px solid #e5e5e5;
              width: 16.66%;
              height: 55px;
              line-height: 55px;
              text-align: center;
              font-size: 19px;
              span{
                display: inline-block;
                width: 8px;
                height: 8px;
                background-color: #000;
                border-radius: 8px;
                text-align: center;
              }
            }
            li:last-child{
              border-right: none;
            }
          }
        }
      }
    }
  }
  .numWrap{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    .downWrap{
      background-color: #fff;
      padding: 5px 0;
      img{
        margin: 0 auto;
        width: 25px;
      }
    }
    ul{
      /* border-bottom: none;
      border-right: none; */
      display: flex;
      flex-wrap: wrap;
      background-color:#fff;
      li{
        font-size: 25px;
        width: 33.333%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        box-sizing: border-box;
        border-top: 1px solid #e5e5e5;
        border-right: 1px solid #e5e5e5;
        /* border-bottom: 1px solid #e5e5e5; */
        img{
          margin: 8px auto;
        }
      }
      li:nth-child(3n){
        border-right: none;
      }
      /* li:nth-child(11){
        border-bottom: 1px solid #fff;
      } */
      li:active{
        background-color: #e5e5e5
      }
      .notNum{
        background-color: #e5e5ee;
      }
    }
  }
  .fade02-enter-active, .fade02-leave-active {
    transition: bottom .5s;
  }
  .fade02-enter, .fade02-leave-to {
    bottom: -240px;
  }
</style>
