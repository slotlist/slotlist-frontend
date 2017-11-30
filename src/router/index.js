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
import MissionSlotTemplateList from '../views/MissionSlotTemplateList'
import MissionSlotTemplateDetails from '../views/MissionSlotTemplateDetails'
import MissionSlotTemplateCreator from '../views/MissionSlotTemplateCreator'
import NotificationList from '../views/NotificationList'
import UserDetails from '../views/UserDetails'
import UserList from '../views/UserList'
import Account from '../views/Account'
import Login from '../views/Login'
import About from '../views/About'
import Imprint from '../views/Imprint'
import Privacy from '../views/Privacy'
import Api from '../views/Api'

Vue.use(Router)

export const router = new Router({
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
      path: '/community-creator',
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
      path: '/mission-creator',
      name: 'missionCreator',
      component: MissionCreator,
      meta: {
        authenticated: true // only logged in users can access this page
      }
    },
    {
      path: '/mission-slot-templates',
      name: 'missionSlotTemplateList',
      component: MissionSlotTemplateList
    },
    {
      path: '/mission-slot-templates/:missionSlotTemplateUid',
      name: 'missionSlotTemplateDetails',
      component: MissionSlotTemplateDetails
    },
    {
      path: '/mission-slot-templates-creator',
      name: 'missionSlotTemplateCreator',
      component: MissionSlotTemplateCreator,
      meta: {
        authenticated: true // only logged in users can access this page
      }
    },
    {
      path: '/notifications',
      name: 'notificationList',
      component: NotificationList,
      meta: {
        authenticated: true // only logged in users can access this page
      }
    },
    {
      path: '/users',
      name: 'userList',
      component: UserList
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

router.beforeEach((to, from, next) => {
  if (store.getters.loggedIn && !store.getters.pollingUnseenNotifications) {
    store.dispatch('getUnseenNotificationCount', { autoRefresh: true })
  }

  next()
})

router.afterEach(() => {
  if (store.getters.showAlert && !store.getters.persistentAlert) {
    store.dispatch('clearAlert')
  }
})

export default router
