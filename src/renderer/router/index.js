import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TrackerMap',
      component: require('@/components/TrackerMap').default
    }, {
      path: '/input',
      name: 'InputMap',
      component: require('@/components/InputMap').default
    },
     {
      path: '/dungeon',
      name: 'TrackerDungeon',
      component: require('@/components/TrackerDungeon').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
