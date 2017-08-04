import axios from 'axios'

export const v1 = {
  getUserDetails(userUid) {
    return axios.get(`/v1/users/${userUid}`)
  },
  getUserMissions(userUid) {
    return axios.get(`/v1/users/${userUid}/missions`)
  }
}

export default v1
