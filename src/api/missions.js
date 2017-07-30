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
  registerMissionSlot(missionSlug, slotUid, comment) {
    console.log(missionSlug, slotUid, comment)
    return axios.post(`/v1/missions/${missionSlug}/slots/${slotUid}/registrations`, { comment })

  }
}

export default v1
