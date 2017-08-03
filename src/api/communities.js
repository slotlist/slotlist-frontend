import axios from 'axios'

export const v1 = {
  getCommunities(limit = 25, offset = 0) {
    return axios.get(`/v1/communities?limit=${limit}&offset=${offset}`)
  },
}

export default v1
