<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item"  :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
        <span class="text">
          <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
        </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook" >
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" @click="selectFood(food,$event)" class="food-item border-1px">
              <div class="icon" >
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="concent">
                <h4 class="name">{{food.name}}</h4>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :select-foods="selectFoods" :deliver-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <food :food="selectedFood" ref="food"></food>
  </div>

</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll'
  import shopcart from 'components/shopcart/shopcart.vue'
  import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
  import food from 'components/food/food.vue'
  const ERR_OK = 0
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data(){
      return{
        goods:[],
        listHeight:[],
        scrollY:[],
        selectedFood:{}
      }

    },
    computed:{
      currentIndex() {
        for(let i=0;i<this.listHeight.length;i++){
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
//          console.log('height1='+height1)
//          console.log('this.scrollY='+this.scrollY)
//          console.log('height2='+height2)
          if(!height2 || (this.scrollY+60 >= height1 && this.scrollY+60 < height2)){
            return i
          }
        }
        return 0
      },
      selectFoods() {
        let foods = []
        this.goods.forEach( (good) =>{
          good.foods.forEach((food) =>{
            if (food.count){
              foods.push(food)
            }
          })
        })

        return foods
      }
    },
    created(){
      this.classMap = ['decrease', 'discount', 'special', 'invoice','guarantee' ]
      this.$http.get('/api/goods').then((response)=>{
        response=response.body
        if (response.errno === ERR_OK) {
          this.goods = response.data
          this.$nextTick(function () {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
      this.$root.eventHub.$on('cartAdd', (target) => {
        this._drop(target)
      })

    },
    methods: {
      selectMenu(index,event){
        if(!event._constructed){
          return
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let el=foodList[index]
        this.foodsScroll.scrollToElement(el,300)
      },
      selectFood(food,event){
        if(!event._constructed){
          return
        }
          this.selectedFood=food
          this.$refs.food.show()
        },
      _drop(target){
        this.$refs.shopcart.drop(target)
      },
      _initScroll() {
        this.meunScroll = new BScroll(this.$refs.menuWrapper,{
          click:true
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
          probeType:3,
          click:true
        })
        this.foodsScroll.on('scroll',(pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight(){
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i=0;i<foodList.length;i++){
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    components:{
      shopcart,
      cartcontrol,
      food
    },
    events: {
      'cart.add'(target){
        this._drop(target)
      }
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    position absolute
    display flex
    overflow hidden
    top 174px
    bottom 46px
    width 100%
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table
        margin 0 -37px
        height 54px
        width 56px
        line-height 14px
        &.current
          width  80px
          position relative
          margin-top -1px
          z-index 10
          background #fff
          font-weight 700
          .text
            border-none()

        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size 12px
          border-1px(rgba(7,17,27,0.1))
    .foods-wrapper
      flex 1
      .food-list
        list-style-type:none
        margin-left -40px
        margin-top -15px
        .title
          padding-left 14px
          height 26px
          line-height 26px
          border-left 2px solid #d9dde1
          font-size 12px
          color rgb(147,153,159)
          background #f3f5f7
          list-style none
        .food-item
          display flex
          border-1px(rgba(7,17,27,0.1))
          padding-bottom 18px
          margin-left -25px
          &:last-child
            border-none()
            margin-bottom 0
          list-style-type:none
          .icon
            flex 0 0 57px
            margin-right 10px
          .content
            flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            font-size 14px
            color rgb(7,17,27)
            line-height 14px
          .desc,.extra
            line-height 10px
            font-size 10px
            color rgb(147,153,159)
          .desc
            margin-bottom 8px
          .extra
            &.count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
            .now
              font-size 14px
              color rgb(240,20,20)
              margin-right 8px
            .old
              text-decoration line-through
              font-size 10px
              color rgb(147,153,159)


          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px



</style>
