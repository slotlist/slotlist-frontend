import axios from 'axios'

export const v1 = {
  getMissions(limit = 25, offset = 0) {
    return axios.get(`/v1/missions?limit=${limit}&offset=${offset}`)
  },
  getMissionDetails(uid) {
    return axios.get(`/v1/missions/${uid}`)
  }
}

export default v1
