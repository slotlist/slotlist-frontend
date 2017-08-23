import axios from 'axios'

export const v1 = {
  getStatus() {
    return axios.get('/v1/status')
  }
}

export default v1
