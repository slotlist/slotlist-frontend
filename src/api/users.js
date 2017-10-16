import axios from 'axios'

export const v1 = {
  getUserDetails(userUid) {
    return axios.get(`/v1/users/${userUid}`)
  },
  getUserMissions(userUid, limit = 10, offset = 0, includeEnded = true) {
    return axios.get(`/v1/users/${userUid}/missions?limit=${limit}&offset=${offset}&includeEnded=${includeEnded}`)
  },
  searchUsers(payload) {
    return axios.get(`/v1/users?search=${payload}`)
  }
}

export default v1
