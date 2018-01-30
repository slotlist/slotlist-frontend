import axios from 'axios'
import * as _ from 'lodash'

export const v1 = {
  addMissionAccess(missionSlug, payload) {
    return axios.post(`/v1/missions/${missionSlug}/accesses`, payload)
  },
  addMissionPermission(missionSlug, payload, suppressNotifications) {
    return axios.post(`/v1/missions/${missionSlug}/permissions`, _.defaults(payload, { suppressNotifications }))
  },
  applySlotTemplateToMission(missionSlug, slotTemplateUid, insertAfter) {
    return axios.post(`/v1/missions/${missionSlug}/slotTemplates/${slotTemplateUid}`, { insertAfter })
  },
  assignMissionSlot(missionSlug, slotUid, userUid, force, suppressNotifications) {
    return axios.post(`/v1/missions/${missionSlug}/slots/${slotUid}/assign`, { userUid, force, suppressNotifications })
  },
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
  deleteMissionAccess(missionSlug, missionAccessUid) {
    return axios.delete(`/v1/missions/${missionSlug}/accesses/${missionAccessUid}`)
  },
  deleteMissionBannerImage(missionSlug) {
    return axios.delete(`/v1/missions/${missionSlug}/bannerImage`)
  },
  deleteMissionPermission(missionSlug, permissionUid) {
    return axios.delete(`/v1/missions/${missionSlug}/permissions/${permissionUid}`)
  },
  deleteMissionSlot(missionSlug, slotUid) {
    return axios.delete(`/v1/missions/${missionSlug}/slots/${slotUid}`)
  },
  deleteMissionSlotGroup(missionSlug, slotGroupUid) {
    return axios.delete(`/v1/missions/${missionSlug}/slotGroups/${slotGroupUid}`)
  },
  deleteMissionToken(missionSlug) {
    return axios.delete(`/v1/missions/${missionSlug}/token`)
  },
  duplicateMission(missionSlug, payload) {
    return axios.post(`/v1/missions/${missionSlug}/duplicate`, payload)
  },
  editMission(missionSlug, payload, suppressNotifications) {
    return axios.patch(`/v1/missions/${missionSlug}`, _.defaults(payload, { suppressNotifications }))
  },
  editMissionSlot(missionSlug, slotUid, payload) {
    return axios.patch(`/v1/missions/${missionSlug}/slots/${slotUid}`, payload)
  },
  editMissionSlotGroup(missionSlug, slotGroupUid, payload) {
    return axios.patch(`/v1/missions/${missionSlug}/slotGroups/${slotGroupUid}`, payload)
  },
  generateMissionToken(missionSlug) {
    return axios.post(`/v1/missions/${missionSlug}/token`)
  },
  getMissionAccesses(missionSlug, limit = 10, offset = 0) {
    return axios.get(`/v1/missions/${missionSlug}/accesses?limit=${limit}&offset=${offset}`)
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
  getMissionsForCalendar(startDate, endDate) {
    return axios.get(`/v1/missions?startDate=${startDate}&endDate=${endDate}`)
  },
  getMissionSlotlist(missionSlug) {
    return axios.get(`/v1/missions/${missionSlug}/slots`)
  },
  getMissionSlotRegistrations(missionSlug, slotUid, limit = 10, offset = 0) {
    return axios.get(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations?limit=${limit}&offset=${offset}`)
  },
  getMissionToken(missionSlug) {
    return axios.get(`/v1/missions/${missionSlug}/token`)
  },
  modifyMissionSlotRegistration(missionSlug, slotUid, registrationUid, confirm, suppressNotifications) {
    return axios.patch(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations/${registrationUid}`, { confirmed: confirm, suppressNotifications })
  },
  registerForMissionSlot(missionSlug, slotUid, comment) {
    return axios.post(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations`, { comment })
  },
  searchMissions(payload) {
    return axios.get(`/v1/missions?search=${payload}`)
  },
  unassignMissionSlot(missionSlug, slotUid) {
    return axios.post(`/v1/missions/${missionSlug}/slots/${slotUid}/unassign`)
  },
  unregisterFromMissionSlot(missionSlug, slotUid, registrationUid) {
    return axios.delete(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations/${registrationUid}`)
  },
  uploadMissionBannerImage(missionSlug, imageType, imageData) {
    return axios.put(`/v1/missions/${missionSlug}/bannerImage`, { imageType, image: imageData })
  }
}

export default v1
