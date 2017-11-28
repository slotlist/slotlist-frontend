import axios from 'axios'

export const v1 = {
  getNotifications() {
    return axios.get('/v1/notifications')
  },
  getUnseenNotificationCount() {
    return axios.get('/v1/notifications/unseen')
  }
}

export default v1
