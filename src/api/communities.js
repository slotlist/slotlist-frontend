import axios from 'axios'

export const v1 = {
  applyToCommunity(communitySlug) {
    return axios.post(`/v1/communities/${communitySlug}/applications`)
  },
  getCommunities(limit = 25, offset = 0) {
    return axios.get(`/v1/communities?limit=${limit}&offset=${offset}`)
  },
  getCommunityDetails(communitySlug) {
    return axios.get(`/v1/communities/${communitySlug}`)
  },
  getCommunityMissions(communitySlug) {
    return axios.get(`/v1/communities/${communitySlug}/missions`)
  },
  getCommunityApplications(communitySlug) {
    return axios.get(`/v1/communities/${communitySlug}/applications`)
  },
  processCommunityApplication(communitySlug, applicationUid, accepted) {
    return axios.patch(`/v1/communities/${communitySlug}/applications/${applicationUid}`, { status: accepted ? 'accepted' : 'denied' })
  },
  removeCommunityMember(communitySlug, memberUid) {
    return axios.delete(`/v1/communities/${communitySlug}/members/${memberUid}`)
  }
}

export default v1
