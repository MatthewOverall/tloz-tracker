import Vue from 'vue'
import axios from 'axios'
import VueInput from './../vue-input'
import App from './App'
import router from './router'
import store from './store'
import 'font-awesome/css/font-awesome'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueInput)
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