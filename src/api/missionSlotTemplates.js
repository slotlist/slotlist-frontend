import axios from 'axios'

export const v1 = {
  createMissionSlotTemplate(payload) {
    return axios.post('/v1/missionSlotTemplates', payload)
  },
  deleteMissionSlotTemplate(missionSlotTemplateUid) {
    return axios.delete(`/v1/missionSlotTemplates/${missionSlotTemplateUid}`)
  },
  editMissionSlotTemplate(missionSlotTemplateUid, payload) {
    return axios.patch(`/v1/missionSlotTemplates/${missionSlotTemplateUid}`, payload)
  },
  getMissionSlotTemplateDetails(missionSlotTemplateUid) {
    return axios.get(`/v1/missionSlotTemplates/${missionSlotTemplateUid}`)
  },
  getMissionSlotTemplates(limit = 10, offset = 0) {
    return axios.get(`/v1/missionSlotTemplates?limit=${limit}&offset=${offset}`)
  }
}

export default v1
