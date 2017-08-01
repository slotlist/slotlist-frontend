import axios from 'axios'

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
  }
}

export default v1
