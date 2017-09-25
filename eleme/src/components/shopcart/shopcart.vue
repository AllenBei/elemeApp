<template>
  <div class="shopcart">
    <div class="content" >
      <div class="content-left" @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
        <div class="desc">另需配送费￥{{deliverPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
      <!--<div class="ball-container">-->
        <!--<transition-group name="drop" @enter="ballEnter" @after-enter="afterenter">-->
          <!--<div v-for="ball in balls" v-show="ball.show" class="ball" :key=1></div>-->
        <!--</transition-group>-->
      <!--</div>-->
      <transition name="fold"  @enter="listflodEnter" @leave="listflodLeave">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price * food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
      </transition>
    </div>
    <transition class="listMask"  @enter="maskEnter" @leave="maskLeave">
    <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>


<script type='text/ecmascript-6'>
  import Velocity from 'velocity-animate'
  import BScroll from 'better-scroll'
  import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
  export default {
    props:{
      selectFoods :{
        type : Array,
        default(){
          return []
        }
      },
      deliverPrice:{
        type:Number,
        default:0
      },
      minPrice:{
        type:Number,
        default:0
      }
    },
    data(){
      return {
        balls: [

        ],
        dropBalls: [],
        fold:true
      }
    },
    computed:{
      totalPrice(){
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount(){
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc(){
        if(this.totalPrice === 0){
          return `￥${this.minPrice}元起送`
        }else if(this.totalPrice < this.minPrice){
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        }else{
          return `去结算`
        }
      },
      payClass(){
        if(this.totalPrice < this.minPrice){
          return 'not-enough'
        }else {
          return 'enough'
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            }
            else {
              this.scroll.refresh()
            }
          })
        }
        return show
      },
    },
    methods: {
      toggleList(){
        if(!this.totalCount){
          return
        }
        this.fold=!this.fold
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      hideList() {
        this.fold = true
      },
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
//      ballEnter(el, done) {
//        let count = this.dropBalls.length
//        let ball = this.dropBalls[count - 1]
//        let rect = ball.el.getBoundingClientRect()
//        let x = rect.left - 32
//        let y = rect.top + 6
//        Velocity(el, {
//          opacity: 1,
//          top: y,
//          left: x
//        }, 0)
//        Velocity(el, {
//          opacity: [0, [1, -0.02, 1, 0.05]],
//          left: '32px',
//          top: [window.innerHeight - 40, [0.71, -0.62, 1, 1]]
//        }, 300)
//        Velocity(el, {opacity: 0}, {complete: done})
//      },
//      afterenter(el) {
//        let ball = this.dropBalls.shift()
//        if (ball) {
//          ball.show = false
//          el.style.display = 'none'
//        }
//      },
      listflodEnter(el, done) {
        Velocity(el, {
          display: 'block',
          bottom: '46px'
        }, {duration: 300, complete: done})
      },
      listflodLeave(el, done) {
        Velocity(el, {
          bottom: `-${el.getBoundingClientRect().height}px`
        }, {duration: 300})
        Velocity(el, {display: 'none'}, {complete: done})
      },
      maskEnter(el,done){
        Velocity(el,{
          display: 'block',
          opacity: 1
        },{duration: 300, complete: done})
      },
      maskLeave(el,done){
        Velocity(el,{
          display: 'none',
          opacity: 0
        },{duration: 300, complete: done})
      }
    },
    components:{
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48pxf
    .content
      display flex
      background #141d27
      height 48px
      font-size 0
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background rgb(0,160,220)
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight  700
            color #fff
            background rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)

        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255,255,255,0.1)
          font-size 16px
          font-weight 700
          color rgba(255,255,255,0.4)
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          color rgba(255,255,255,0.4)
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        color rgba(255,255,255,0.4)
        .pay
          height 48px
          line-height 48px
          text-align center
          font-weight 700
          font-size 14px
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff




    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        &.drop-transition
          transition all 0.4s
          .inner
            width 16px
            height 16px
            border-radius 50%
            background rgb(0,160,220)
            transition all 0.4s
    .shopcart-list
      position: absolute;
      z-index: -1;
      left 0
      bottom 48px
      background-color: #fff;
      width: 100%;
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background  #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          float left
          font-size 14px
          color rgb(7,17,27)
        .empty
          float right
          font-size 12px
          color rgb(0,160,220)
      .list-content
        position relative
        right  50px
        bottom 15px
        max-height 217px
        overflow hidden
        background #fff
        padding 0 15px
        width 100%
        .food
          position relative
          margin-right  -30px
          padding 12px 0px
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height: 24px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          .price
            position: absolute;
            right: 20px;
            bottom: 12px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240, 20, 20);
          .cartcontrol-wrapper
            position absolute
            right 90px
            bottom 6px



    .list-mask
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      z-index -2
      backdrop-filter:blur(10px)
      background rgba(7,17,27,0.6)
</style>
