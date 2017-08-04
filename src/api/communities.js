import axios from 'axios'

export const v1 = {
  applyToCommunity(communitySlug) {
    return axios.post(`/v1/communities/${communitySlug}/applications`)
  },
  checkCommunitySlugAvailability(missionSlug) {
    return axios.get(`/v1/communities/slugAvailable?slug=${missionSlug}`)
  },
  createCommunity(payload) {
    return axios.post('/v1/communities', payload)
  },
  deleteCommunity(communitySlug) {
    return axios.delete(`/v1/communities/${communitySlug}`)
  },
  editCommunity(communitySlug, payload) {
    return axios.patch(`/v1/communities/${communitySlug}`, payload)
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
