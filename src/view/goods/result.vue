<template>
  <div class="main">
    <header>
      <div class="header">
          <span class="goback" @click="goback"><img src="@/assets/facePayMobile/images/goback.png" /></span>
          订单提交{{state==='succ'?'成功':'失败'}}
      </div>
    </header>
    <img class="stateImg" :src="state==='succ'?succ_img:erro_img"/>
    <h2 class="stateName">订单提交{{state==='succ'?'成功':'失败'}}</h2>
  </div>
</template>
<script>
import succ from '@/assets/facePayMobile/images/succ.png'
import erro from '@/assets/facePayMobile/images/erro.png'
export default {
  data () {
    return {
      state: '',
      result_img: '',
      succ_img: succ,
      erro_img: erro
    }
  },
  methods: {
    goback () {
      this.$router.go(-1)
    }
  },
  created () {
    this.state = this.$route.query.state
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
</style>
