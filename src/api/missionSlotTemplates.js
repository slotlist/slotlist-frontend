import axios from 'axios'
import * as _ from 'lodash'

export const v1 = {
  getMissionSlotTemplates(limit = 10, offset = 0) {
    return axios.get(`/v1/missionSlotTemplates?limit=${limit}&offset=${offset}`)
  }
}

export default v1
