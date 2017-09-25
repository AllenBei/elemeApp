// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import good from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import './common/stylus/index.styl'
Vue.use(VueRouter)
Vue.use(VueResource)

Vue.config.productionTip = false

/* eslint-disable no-new */
// const goods = {template: good}

const routes = [
  { path: '/goods', component: good },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})

new Vue({
  el: '#app',
  router,
  data: {
    eventHub: new Vue()
  },
  render: h => h(App)
}).$mount('#app')
router.push('/goods')

