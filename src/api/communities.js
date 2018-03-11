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
  deleteCommunityLogo(communitySlug) {
    return axios.delete(`/v1/communities/${communitySlug}/logo`)
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
  getCommunityApplications(communitySlug, limit = 10, offset = 0, includeProcessed = false) {
    return axios.get(`/v1/communities/${communitySlug}/applications?limit=${limit}&offset=${offset}&includeProcessed=${includeProcessed}`)
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
  getCommunityRepositories(communitySlug) {
    return axios.get(`/v1/communities/${communitySlug}/repositories`)
  },
  getCommunityServers(communitySlug) {
    return axios.get(`/v1/communities/${communitySlug}/servers`)
  },
  processCommunityApplication(communitySlug, applicationUid, accepted) {
    return axios.patch(`/v1/communities/${communitySlug}/applications/${applicationUid}`, { status: accepted ? 'accepted' : 'denied' })
  },
  removeCommunityMember(communitySlug, memberUid) {
    return axios.delete(`/v1/communities/${communitySlug}/members/${memberUid}`)
  },
  searchCommunities(payload) {
    return axios.get(`/v1/communities?search=${payload}`)
  },
  uploadCommunityLogo(communitySlug, imageType, imageData) {
    return axios.put(`/v1/communities/${communitySlug}/logo`, { imageType, image: imageData })
  }
}

export default v1
