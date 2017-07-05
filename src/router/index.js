import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import MissionList from '../views/MissionList'
import MissionDetails from '../views/MissionDetails'
import CommunityList from '../views/CommunityList'
import CommunityDetails from '../views/CommunityDetails'
import Account from '../views/account'
import Login from '../views/login'
import AdminPanel from '../views/AdminPanel'
import About from '../views/About'
import Privacy from '../views/Privacy'
import Api from '../views/Api'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    { path: '/', component: Home },
    { path: '/missions', component: MissionList },
    { path: '/missions/:missionId', component: MissionDetails },
    { path: '/communities', component: CommunityList },
    { path: '/communities/:communityId', component: CommunityDetails },
    { path: '/account', component: Account },
    { path: '/login', component: Login },
    { path: '/admin', component: AdminPanel },
    { path: '/about', component: About },
    { path: '/privacy', component: Privacy },
    { path: '/api', component: Api },
  ],
  linkExactActiveClass: "active"
})
