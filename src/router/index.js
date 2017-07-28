import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Home from '../views/Home'
import MissionList from '../views/MissionList'
import MissionDetails from '../views/MissionDetails'
import CommunityList from '../views/CommunityList'
import CommunityDetails from '../views/CommunityDetails'
import Account from '../views/Account'
import Login from '../views/Login'
import AdminPanel from '../views/AdminPanel'
import About from '../views/About'
import Privacy from '../views/Privacy'
import Api from '../views/Api'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/missions', name: 'missionList', component: MissionList },
    { path: '/missions/:slug', name: 'missionDetails', component: MissionDetails, props: true },
    { path: '/communities', name: 'communityList', component: CommunityList },
    { path: '/communities/:communityId', name: 'communityDetails', component: CommunityDetails },
    { path: '/account', name: 'account', component: Account },
    { path: '/login', name: 'login', component: Login, beforeEnter: (to, from, next) => { store.dispatch('setRedirect', { path: from.path }); next() } },
    { path: '/admin', name: 'admin', component: AdminPanel, meta: { permissions: 'admin.panel' } },
    { path: '/about', name: 'about', component: About },
    { path: '/privacy', name: 'privacy', component: Privacy },
    { path: '/api', name: 'api', component: Api },
  ],
  linkExactActiveClass: "active"
})
