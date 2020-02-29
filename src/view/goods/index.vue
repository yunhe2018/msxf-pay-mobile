<template>
  <div class="main">
      <header><div class="header">订单</div></header>
      <ul class="doodsDiv">
        <li v-for="(item, index) in goods" :key=index>
          <img :src="item.picture" />
          <h3>{{item.goodsName}}</h3>
          <p>{{item.goodsTxt}}</p>
          <div class="lotalPrice">
            <span class="price">${{item.unitPrice}}</span>
            <span class="count">
              <img class="reduce" v-if="item.count > 0" @click="reduce(item)" src="@/assets/facePayMobile/images/_reduce.png" />
              <img class="reduce" v-else src="@/assets/facePayMobile/images/reduce.png" />
              <i class="num">{{item.count}}</i>
              <img class="plus" @click="plus(item)" src="@/assets/facePayMobile/images/_plus.png" />
            </span>
          </div>
        </li>
      </ul>
      <div class="botmWrap">
        <div class="botm">
          <p>商品总价：<span>￥{{total}}</span></p>
          <button @click= "toPay">去结算</button>
        </div>
      </div>
  </div>
</template>

<script>
import pic01 from '@/assets/facePayMobile/goods/01.png'
import pic02 from '@/assets/facePayMobile/goods/02.jpg'
import pic03 from '@/assets/facePayMobile/goods/03.jpg'
import pic04 from '@/assets/facePayMobile/goods/04.jpg'
import { createOrder } from '@/request/goodsTest/index.js'

export default {
  data () {
    return {
      goods: [
        {
          goodsName: 'Romanee-Conti',
          goodsTxt: '法国罗曼尼康帝酒园Romanee-Conti红葡萄酒',
          unitPrice: 108, // 商品单价
          count: 0, // 商品数量
          picture: pic01 // 商品图片
        },
        {
          goodsName: '大拉菲',
          goodsTxt: '拉菲古堡干红葡萄酒 大拉菲',
          unitPrice: 198, // 商品单价
          count: 0, // 商品数量
          picture: pic02 // 商品图片
        },
        {
          goodsName: '柏图斯',
          goodsTxt: '柏翠庄园/柏图斯正牌干红葡萄酒',
          unitPrice: 208, // 商品单价
          count: 0, // 商品数量
          picture: pic03 // 商品图片
        },
        {
          goodsName: '木桐庄园',
          goodsTxt: '木桐庄园正牌红葡萄酒 原瓶进口',
          unitPrice: 118, // 商品单价
          count: 0, // 商品数量
          picture: pic04 // 商品图片
        }
      ],
      discount: ''
    }
  },
  methods: {
    plus (item) {
      item.count++
    },
    reduce (item) {
      if (item.count > 0) {
        item.count--
      }
    },
    toPay () {
      const goodsList = this.goods.filter(i => i.count > 0)
      createOrder({
        // merchantId: sessionStorage.getItem('merchantId'),
        // memberId: sessionStorage.getItem('memberId'),
        total: this.total,
        goods: goodsList
      }).then(res => {
        this.$router.push({
          path: '/goodsState',
          query: {state: 'succ'}
        })
      }).catch(erro => {
        this.$router.push({
          path: '/goodsState',
          query: {state: 'erro'}
        })
      })
    }
  },
  computed: {
    total () {
      let num = 0
      this.goods.forEach(i => {
        num = num + i.count * i.unitPrice
      })
      return num
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  background-color: #f7f7f7;
  height: 100%;
  .doodsDiv{
    display: flex;
    flex-wrap: wrap;
    justify-content:space-around;
    margin: 10px 5px;
    li{
      margin: 0 0 4px;
      padding: 0px 0px 5px;
      width: 49%;
      background-color: #fff;
      overflow: hidden;
      img{
        width: 100%;
      }
      h3{
        font-size: 17px;
        color: #222;
        font-weight: normal;
        line-height: 30px;
        padding: 7px 10px 0;
      }
      p{
        font-size: 14px;
        color: #666;
        font-weight: normal;
        padding: 2px 10px 0;
        overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
      }
      .lotalPrice{
        display: flex;
        justify-content: space-between;
        padding: 8px 10px 0;
        .price{
          color: #497BEC;
          font-size: 16px;
        }
        .count{
          display: flex;
          .plus,.reduce{
            width: 15px;
            height: 15px;
            padding: 0 5px 0;
          }
          i{
            font-style: normal;
            font-size: 15px;
            margin-top: -2px;
          }
        }
      }
    }
  }
  .botmWrap{
    height:75px;
    /* background-color: #f90; */
    .botm{
      /* display: flex; */
      /* justify-content: space-around; */
      position: relative;
      height: 55px;
      box-sizing: border-box;
      background-color: #fff;
      position: fixed;
      width:100%;
      left:0;
      bottom:0;
      border-top: 1px solid #e5e5e5;
      p{
        line-height: 55px;
        padding-left: 15px;
        font-size: 15px;
        color: #999;
        span{
          padding-left: 10px;
          color: #497BEC;
          font-size: 17px;
        }
      }
      button{
        outline: none;
        border: none;
        color: #fff;
        font-size: 17px;
        position:absolute;
        right:0;
        top: 0;
        width:100px;
        height:55px;
        line-height: 55px;
        background-color: #497BEC;
      }

    }
  }
}
</style>
