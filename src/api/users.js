import axios from 'axios'

export const v1 = {
  deleteUser(userUid) {
    return axios.delete(`/v1/users/${userUid}`)
  },
  editUser(userUid, payload) {
    return axios.patch(`/v1/users/${userUid}`, payload)
  },
  getUserDetails(userUid) {
    return axios.get(`/v1/users/${userUid}`)
  },
  getUserMissions(userUid, limit = 10, offset = 0, includeEnded = true) {
    return axios.get(`/v1/users/${userUid}/missions?limit=${limit}&offset=${offset}&includeEnded=${includeEnded}`)
  },
  getUsers(limit = 10, offset = 0) {
    return axios.get(`/v1/users?limit=${limit}&offset=${offset}`)
  },
  searchUsers(payload) {
    return axios.get(`/v1/users?search=${payload}`)
  }
}

export default v1
