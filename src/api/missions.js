import axios from 'axios'

export const v1 = {
  getMissions(limit, offset) {
    return axios.get('/v1/missions')
  },
  getMissionDetails(uid) {
    return axios.get(`/v1/missions/${uid}`)
  }
}

export default v1
