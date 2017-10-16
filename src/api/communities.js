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
  createCommunityPermission(communitySlug, payload) {
    return axios.post(`/v1/communities/${communitySlug}/permissions`, payload)
  },
  deleteCommunity(communitySlug) {
    return axios.delete(`/v1/communities/${communitySlug}`)
  },
  deleteCommunityPermission(communitySlug, permissionUid) {
    return axios.delete(`/v1/communities/${communitySlug}/permissions/${permissionUid}`)
  },
  editCommunity(communitySlug, payload) {
    return axios.patch(`/v1/communities/${communitySlug}`, payload)
  },
  getCommunities(limit = 10, offset = 0) {
    return axios.get(`/v1/communities?limit=${limit}&offset=${offset}`)
  },
  getCommunityApplications(communitySlug, limit = 10, offset = 0) {
    return axios.get(`/v1/communities/${communitySlug}/applications?limit=${limit}&offset=${offset}`)
  },
  getCommunityApplicationStatus(communitySlug) {
    return axios.get(`/v1/communities/${communitySlug}/applications/status`)
  },
  getCommunityDetails(communitySlug) {
    return axios.get(`/v1/communities/${communitySlug}`)
  },
  getCommunityMissions(communitySlug, limit = 10, offset = 0, includeEnded = false) {
    return axios.get(`/v1/communities/${communitySlug}/missions?limit=${limit}&offset=${offset}&includeEnded=${includeEnded}`)
  },
  getCommunityPermissions(communitySlug, limit = 10, offset = 0) {
    return axios.get(`/v1/communities/${communitySlug}/permissions?limit=${limit}&offset=${offset}`)
  },
  processCommunityApplication(communitySlug, applicationUid, accepted) {
    return axios.patch(`/v1/communities/${communitySlug}/applications/${applicationUid}`, { status: accepted ? 'accepted' : 'denied' })
  },
  removeCommunityMember(communitySlug, memberUid) {
    return axios.delete(`/v1/communities/${communitySlug}/members/${memberUid}`)
  },
  searchCommunities(payload) {
    return axios.get(`/v1/communities?search=${payload}`)
  }
}

export default v1
