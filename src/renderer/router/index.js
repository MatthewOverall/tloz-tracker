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
      path: '/config',
      name: 'ConfigPanel',
      component: require('@/components/ConfigPanel').default
    },
     {
      path: '/dungeon',
      name: 'TrackerDungeon',
      component: require('@/components/TrackerDungeon').default
    },
    {
      path: '/gamepad',
      name: 'GamepadViewer',
      component: require('@/../Game/GamepadViewer').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
