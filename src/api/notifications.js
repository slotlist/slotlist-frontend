import axios from 'axios'

export const v1 = {
  getNotifications(includeSeen = false) {
    return axios.get(`/v1/notifications?includeSeen=${includeSeen}`)
  },
  getUnseenNotificationCount() {
    return axios.get('/v1/notifications/unseen')
  }
}

export default v1
