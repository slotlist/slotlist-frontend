import axios from 'axios'

export const v1 = {
  getMissions(limit = 25, offset = 0) {
    return axios.get(`/v1/missions?limit=${limit}&offset=${offset}`)
  },
  getMissionDetails(slug) {
    return axios.get(`/v1/missions/${slug}`)
  },
  getMissionSlotlist(slug, limit = 25, offset = 0) {
    return axios.get(`/v1/missions/${slug}/slots?limit=${limit}&offset=${offset}`)
  }
}

export default v1
