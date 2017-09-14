import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Home from '../views/Home'
import CommunityList from '../views/CommunityList'
import CommunityDetails from '../views/CommunityDetails'
import CommunityCreator from '../views/CommunityCreator'
import MissionList from '../views/MissionList'
import MissionDetails from '../views/MissionDetails'
import MissionCreator from '../views/MissionCreator'
import UserDetails from '../views/UserDetails'
import Account from '../views/Account'
import Login from '../views/Login'
import AdminPanel from '../views/AdminPanel'
import About from '../views/About'
import Imprint from '../views/Imprint'
import Privacy from '../views/Privacy'
import Api from '../views/Api'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/communities',
      name: 'communityList',
      component: CommunityList
    },
    {
      path: '/communities/:communitySlug',
      name: 'communityDetails',
      component: CommunityDetails
    },
    {
      path: '/communitycreator',
      name: 'communityCreator',
      component: CommunityCreator,
      meta: {
        authenticated: true // only logged in users can access this page
      }
    },
    {
      path: '/missions',
      name: 'missionList',
      component: MissionList
    },
    {
      path: '/missions/:missionSlug',
      name: 'missionDetails',
      component: MissionDetails
    },
    {
      path: '/missioncreator',
      name: 'missionCreator',
      component: MissionCreator,
      meta: {
        authenticated: true // only logged in users can access this page
      }
    },
    {
      path: '/users/:userUid',
      name: 'userDetails',
      component: UserDetails
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      meta: {
        authenticated: true // only logged in users can access this page
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        // Set path of previous route before accessing login route, used for redirects after successful authentication
        store.dispatch('setRedirect', { path: from.path })
        next()
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPanel,
      meta: {
        authenticated: true, // only logged in users can access this page
        permissions: 'admin.panel' // only users with the `admin.panel` permission can access this page
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/imprint',
      name: 'imprint',
      component: Imprint
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: Privacy
    },
    {
      path: '/api',
      name: 'api',
      component: Api
    }
  ],
  linkExactActiveClass: 'active'
})
