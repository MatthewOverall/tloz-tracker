import Vue from 'vue'
import axios from 'axios'
import 'font-awesome/css/font-awesome'
import App from './App'
import router from './router'
import store from './store'
import VueGame from './../Game/VueGame'
import { sync } from 'vuex-router-sync'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
const unsync = sync(store, router)
Vue.use(VueGame)
/* eslint-disable no-new */
let v = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  mounted () {
  }
})
v.$mount('#app')
window.Vue = v