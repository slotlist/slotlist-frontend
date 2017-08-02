import axios from 'axios'
import * as _ from 'lodash'

export const v1 = {
  getMissions(limit = 25, offset = 0) {
    return axios.get(`/v1/missions?limit=${limit}&offset=${offset}`)
  },
  getMissionDetails(missionSlug) {
    return axios.get(`/v1/missions/${missionSlug}`)
  },
  getMissionSlotlist(missionSlug, limit = 25, offset = 0) {
    return axios.get(`/v1/missions/${missionSlug}/slots?limit=${limit}&offset=${offset}`)
  },
  registerForMissionSlot(missionSlug, slotUid, comment) {
    return axios.post(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations`, { comment })
  },
  createMissionSlot(missionSlug, payload) {
    return axios.post(`/v1/missions/${missionSlug}/slots`, _.isArray(payload) ? payload : [payload])
  },
  editMissionSlot(missionSlug, slotUid, payload) {
    return axios.patch(`/v1/missions/${missionSlug}/slots/${slotUid}`, payload)
  },
  deleteMissionSlot(missionSlug, slotUid) {
    return axios.delete(`/v1/missions/${missionSlug}/slots/${slotUid}`)
  },
  deleteMission(missionSlug) {
    return axios.delete(`/v1/missions/${missionSlug}`)
  },
  editMission(missionSlug, payload) {
    return axios.patch(`/v1/missions/${missionSlug}`, payload)
  },
  unregisterFromMissionSlot(missionSlug, slotUid, registrationUid) {
    return axios.delete(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations/${registrationUid}`)
  },
  checkMissionSlugAvailability(missionSlug) {
    return axios.get(`/v1/missions/slugAvailable?slug=${missionSlug}`)
  },
  createMission(payload) {
    return axios.post('/v1/missions', payload)
  },
  getMissionSlotRegistrations(missionSlug, slotUid) {
    return axios.get(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations`)
  },
  modifyMissionSlotRegistration(missionSlug, slotUid, registrationUid, confirm) {
    return axios.patch(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations/${registrationUid}`, { confirmed: confirm })
  }
}

export default v1
