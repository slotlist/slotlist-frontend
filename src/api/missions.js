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
  getMissionDetails(missionSlug) {
    return axios.get(`/v1/missions/${missionSlug}`)
  },
  getMissions(limit = 10, offset = 0) {
    return axios.get(`/v1/missions?limit=${limit}&offset=${offset}`)
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
  }
}

export default v1
