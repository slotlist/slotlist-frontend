import axios from 'axios'
import * as _ from 'lodash'

export const v1 = {
  checkMissionSlugAvailability(missionSlug) {
    return axios.get(`/v1/missions/slugAvailable?slug=${missionSlug}`)
  },
  createMission(payload) {
    return axios.post('/v1/missions', payload)
  },
  createMissionSlot(missionSlug, payload) {
    return axios.post(`/v1/missions/${missionSlug}/slots`, _.isArray(payload) ? payload : [payload])
  },
  createMissionSlotGroup(missionSlug, payload) {
    return axios.post(`/v1/missions/${missionSlug}/slotGroups`, payload)
  },
  deleteMission(missionSlug) {
    return axios.delete(`/v1/missions/${missionSlug}`)
  },
  deleteMissionBannerImage(missionSlug) {
    return axios.delete(`/v1/missions/${missionSlug}/bannerImage`)
  },
  deleteMissionSlot(missionSlug, slotUid) {
    return axios.delete(`/v1/missions/${missionSlug}/slots/${slotUid}`)
  },
  deleteMissionSlotGroup(missionSlug, slotGroupUid) {
    return axios.delete(`/v1/missions/${missionSlug}/slotGroups/${slotGroupUid}`)
  },
  editMission(missionSlug, payload) {
    return axios.patch(`/v1/missions/${missionSlug}`, payload)
  },
  editMissionSlot(missionSlug, slotUid, payload) {
    return axios.patch(`/v1/missions/${missionSlug}/slots/${slotUid}`, payload)
  },
  editMissionSlotGroup(missionSlug, slotGroupUid, payload) {
    return axios.patch(`/v1/missions/${missionSlug}/slotGroups/${slotGroupUid}`, payload)
  },
  getMissionDetails(missionSlug) {
    return axios.get(`/v1/missions/${missionSlug}`)
  },
  getMissionPermissions(missionSlug, limit = 10, offset = 0) {
    return axios.get(`/v1/missions/${missionSlug}/permissions?limit=${limit}&offset=${offset}`)
  },
  getMissions(limit = 10, offset = 0, includeEnded = false) {
    return axios.get(`/v1/missions?limit=${limit}&offset=${offset}&includeEnded=${includeEnded}`)
  },
  getMissionSlotlist(missionSlug) {
    return axios.get(`/v1/missions/${missionSlug}/slots`)
  },
  getMissionSlotRegistrations(missionSlug, slotUid, limit = 10, offset = 0) {
    return axios.get(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations?limit=${limit}&offset=${offset}`)
  },
  modifyMissionSlotRegistration(missionSlug, slotUid, registrationUid, confirm) {
    return axios.patch(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations/${registrationUid}`, { confirmed: confirm })
  },
  registerForMissionSlot(missionSlug, slotUid, comment) {
    return axios.post(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations`, { comment })
  },
  unregisterFromMissionSlot(missionSlug, slotUid, registrationUid) {
    return axios.delete(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations/${registrationUid}`)
  },
  uploadMissionBannerImage(missionSlug, imageType, imageData) {
    return axios.put(`/v1/missions/${missionSlug}/bannerImage`, { imageType, image: imageData })
  }
}

export default v1
