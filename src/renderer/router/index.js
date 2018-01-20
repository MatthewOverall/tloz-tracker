import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TrackerMap',
      component: require('@/components/TrackerMap').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
