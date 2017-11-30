import axios from 'axios'

export const v1 = {
  getNotifications(limit = 10, offset = 0, includeSeen = false) {
    return axios.get(`/v1/notifications?limit=${limit}&offset=${offset}&includeSeen=${includeSeen}`)
  },
  getUnseenNotificationCount() {
    return axios.get('/v1/notifications/unseen')
  }
}

export default v1
