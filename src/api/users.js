import axios from 'axios'

export const v1 = {
  getUserDetails(userUid) {
    return axios.get(`/v1/users/${userUid}`)
  },
  getUserMissions(userUid) {
    return axios.get(`/v1/users/${userUid}/missions`)
  },
  searchUsers(payload) {
    return axios.get(`/v1/users?search=${payload}`)
  }
}

export default v1
