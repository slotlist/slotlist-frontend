import axios from 'axios'

export const v1 = {
  createAnnouncement(payload) {
    return axios.post('/v1/announcements', payload)
  },
  deleteAnnouncement(announcementUid) {
    return axios.delete(`/v1/announcements/${announcementUid}`)
  },
  editAnnouncement(announcementUid, payload) {
    return axios.patch(`/v1/announcements/${announcementUid}`, payload)
  },
  getAnnouncements(limit = 10, offset = 0) {
    return axios.get(`/v1/announcements?limit=${limit}&offset=${offset}`)
  }
}

export default v1
