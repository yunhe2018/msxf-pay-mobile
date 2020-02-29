<template>
  <div>
    <span class="txt">我是test页</span>
    <ul>
      <li><label>密码：<input :type="psdType? 'password': 'text'" ></label><button @click='checkType'>切换弦音</button></li>
      <li><label>密码：<input type="password" ></label></li>
      <li>
          <!-- <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#iconhaha"></use>
            </svg> -->
        <i class="icon iconfont iconarrow"></i>
      </li>
    </ul>
    <button @click='showToast'>toast-test</button>
    <transition name="fade">
      <div class="toast" v-if="toastFlag">
        <span class="txt">嘿嘿嘿哈哈哈嘎嘎嘎渣渣渣</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { bankCardAttribution } from '@/lib/bank.js'

export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      psdType: true,
      toastFlag: false
    }
  },
  methods: {
    checkType () {
      this.psdType = !this.psdType
    },
    showToast () {
      this.toastFlag = true
      setTimeout(() => {
        this.toastFlag = false
      }, 1500)
    },
    getBankBin (cardNo) {
      var errMsg = ''
      if (isNaN(cardNo)) {
        cardNo = parseInt(cardNo)
        if (isNaN(cardNo)) {
          errMsg = cardNo + ':银行卡号必须是数字'
          return errMsg
        }
      }
      if (cardNo.toString().length < 15 || cardNo.toString().length > 19) {
        errMsg = cardNo + ':银行卡位数必须是15到19位'
        return errMsg
      }
    }
  },
  created () {
    console.log('银行名称：' + bankCardAttribution(6212260200028053631).bankName)
    console.log('银行卡类别：' + bankCardAttribution(6212260200028053631).cardTypeName)
    console.log('银行名称：' + bankCardAttribution(6228120200028053).bankName)
    console.log('银行卡类别：' + bankCardAttribution(6228120200028053).cardTypeName)
  }
}
</script>

<style lang="scss" scoped>
input{
  border: 1px solid #999;
  outline: none;
  padding-left: 20px;
  height:52px;
  line-height: 52px;
  font-size: 40px;
  color: #333;
}

</style>
