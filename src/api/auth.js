import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

export const v1 = {
  getLoginRedirectUrl() {
    return axios.get('/v1/auth/steam')
  },
  performLogin(url) {
    return axios.post('/v1/auth/steam', { url })
  }
}

if (process.env.NODE_ENV === 'development') {
  const mock = new MockAdapter(axios)

  mock.onGet('/v1/auth/steam').reply(200, {
    url: 'https://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.return_to=http%3A%2F%2Flocalhost%3A4000%2F%23%2Flogin&openid.realm=http%3A%2F%2Flocalhost%3A4000'
  })

  mock.onPost('/v1/auth/steam').reply(200, {
    token: 'TOTALLYLEGITJWT'
  })
}

export default v1
