import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Mission from '../views/Mission'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    { path: '/', component: Home },
    { path: '/missions/:missionId', component: Mission}
  ]
})