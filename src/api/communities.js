import axios from 'axios'

export const v1 = {
  getCommunities(limit = 25, offset = 0) {
    return axios.get(`/v1/communities?limit=${limit}&offset=${offset}`)
  },
  getCommunityDetails(communitySlug) {
    return axios.get(`/v1/communities/${communitySlug}`)
  },
  removeCommunityMember(communitySlug, memberUid) {
    return axios.delete(`/v1/communities/${communitySlug}/members/${memberUid}`)
  }
}

export default v1
