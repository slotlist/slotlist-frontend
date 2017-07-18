import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import * as _ from 'lodash'

const mockMissions = require('./mock/missions')

if (process.env.MOCK_AXIOS_RESPONSES) {
  const mock = new MockAdapter(axios, { delayResponse: 500 })

  mock.onGet('/v1/auth/steam').reply(200, {
    url: 'https://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.return_to=http%3A%2F%2Flocalhost%3A4000%2F%23%2Flogin&openid.realm=http%3A%2F%2Flocalhost%3A4000'
  })

  mock.onPost('/v1/auth/steam').reply(200, {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTY5ODg0Ny1kZDFjLTRkYjUtOGE5Mi1lZWFhZDc0OGI3YTYiLCJ1c2VyIjp7InVpZCI6IjVlNjk4ODQ3LWRkMWMtNGRiNS04YTkyLWVlYWFkNzQ4YjdhNiIsIm5pY2tuYW1lIjoiVGVzdHVzZXIifSwicGVybWlzc2lvbnMiOlsiYWRtaW4uKiIsIm1pc3Npb24uKiIsImNvbW11bml0eS4qIl19.WGTcsUh0jPFGHELbKNZ54Kotd3Vb6fMlCBSwz7J3dqQ'
  })

  mock.onGet('/v1/missions').reply(200, {
    missions: mockMissions
  })

  mock.onGet(/\/v1\/missions\/([\w-]+)/).reply((config) => {
    const missionSlug = /\/v1\/missions\/([\w-]+)/.exec(config.url)[1]
    const mission = _.find(mockMissions, ['slug', missionSlug])
    if (_.isNil(mission)) {
      return [404, {}]
    }

    return [200, { mission: mission }]
  })
}
