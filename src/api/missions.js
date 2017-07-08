import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import * as _ from 'lodash'

const mockMissions = require('./mock/missions')

export const v1 = {
  getMissions(limit, offset) {
    return axios.get('/v1/missions')
  },
  getMissionDetails(uid) {
    return axios.get(`/v1/missions/${uid}`)
  }
}

if (process.env.NODE_ENV === 'development') {
  const mock = new MockAdapter(axios)

  mock.onGet('/v1/missions').reply(200, {
    missions: mockMissions
  })

  mock.onGet(/\/v1\/missions\/([\w-]+)/).reply((config) => {
    const missionUid = /\/v1\/missions\/([\w-]+)/.exec(config.url)[1]
    const mission = _.find(mockMissions, 'uid', missionUid)
    if (_.isNil(mission)) {
      return [404, {}]
    }

    return [200, { mission: mission }]
  })
}

export default v1
