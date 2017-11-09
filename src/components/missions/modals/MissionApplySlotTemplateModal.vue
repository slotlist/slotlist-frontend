<template>
  <div>
    <b-modal id="missionApplySlotTemplateModal" ref="missionApplySlotTemplateModal" v-if="missionSlotTemplates" size="lg" :title="$t('mission.modal.apply.slotTemplate')" @shown="setMissionApplySlotTemplateData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="applySlotTemplateToMission">
          <div class="row">
            <div class="col">
              <p v-html="$t('mission.apply.slotTemplate.description')"></p>
            </div>
          </div>
          <hr class="my-4">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotTemplate.filter')" :description="$t('mission.slotTemplate.filter.description')">
                <b-form-input v-model="missionSlotTemplateFilter" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotTemplate.insertAfter')" :description="$t('mission.slotTemplate.insertAfter.description')">
                <b-form-select v-model="missionSlotTemplateInsertAfter" :options="missionSlotTemplateInsertAfterOptions"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th style="width: 30%">{{ $t('mission.list.title') }}</th>
                    <th style="width: 20%">{{ $t('mission.list.creator') }}</th>
                    <th style="width: 15%" class="text-center">{{ $t('mission.slotTemplate.list.counts.slots.groups')}}</th>
                    <th style="width: 10%" class="text-center">{{ $t('mission.slotTemplate.list.counts.slots')}}</th>
                    <th style="width: 22%" class="text-center">{{ $t('misc.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="missionSlotTemplate in filteredMissionSlotTemplates" :key="missionSlotTemplate.uid">
                    <td>{{ missionSlotTemplate.title }}</td>
                    <td><router-link :to="{name: 'userDetails', params: {userUid: missionSlotTemplate.creator.uid}}">{{ formatUserWithTag(missionSlotTemplate.creator) }}</router-link></td>
                    <td class="text-center">{{ missionSlotTemplate.slotGroupCount }}</td>
                    <td class="text-center">{{ missionSlotTemplate.slotCount }}</td>
                    <td class="text-center">
                      <b-btn variant="primary" size="sm" :to="{name: 'missionSlotTemplateDetails', params: {missionSlotTemplateUid: missionSlotTemplate.uid}}">
                        <i class="fa fa-info" aria-hidden="true"></i> {{ $t('button.details') }}
                      </b-btn>
                      <b-btn variant="success" size="sm" @click="applySlotTemplateToMission(missionSlotTemplate.uid)">
                        <i class="fa fa-file-text-o" aria-hidden="true"></i> {{ $t('button.apply.mission.slotGroup.short') }}
                      </b-btn>
                    </td>
                  </tr>
                </tbody>
                <tfoot v-show="filteredMissionSlotTemplates.length >= 10">
                  <tr>
                    <th style="width: 30%">{{ $t('mission.list.title') }}</th>
                    <th style="width: 20%">{{ $t('mission.list.creator') }}</th>
                    <th style="width: 15%" class="text-center">{{ $t('mission.slotTemplate.list.counts.slots.groups')}}</th>
                    <th style="width: 10%" class="text-center">{{ $t('mission.slotTemplate.list.counts.slots')}}</th>
                    <th style="width: 22%" class="text-center">{{ $t('misc.actions') }}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission apply slot template actions">
          <b-btn @click="hideMissionConvertToSlotTemplateModal">
            <i class="fa fa-close" aria-hidden="true"></i> {{ $t('button.cancel') }}
          </b-btn>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  data() {
    return {
      missionSlotTemplateFilter: null,
      missionSlotTemplateInsertAfter: 0
    }
  },
  beforeCreate: function() {
    this.$store.dispatch('getMissionSlotTemplates', { limit: 100 })
  },
  computed: {
    filteredMissionSlotTemplates() {
      const missionSlotTemplates = this.missionSlotTemplates
      if (_.isNil(this.missionSlotTemplateFilter) || _.isEmpty(this.missionSlotTemplateFilter)) {
        return missionSlotTemplates
      }

      const filteredMissionSlotTemplates = _.filter(missionSlotTemplates, (slotTemplate) => {
        return _.includes(_.toLower(slotTemplate.title), _.toLower(this.missionSlotTemplateFilter)) || _.includes(_.toLower(slotTemplate.creator.nickname), _.toLower(this.missionSlotTemplateFilter))
      })

      return filteredMissionSlotTemplates
    },
    missionSlotTemplateInsertAfterOptions() {
      const options = [{
        value: 0,
        text: this.$t('mission.slotGroup.insertAfter.top')
      }]

      if (_.isNil(this.missionSlotGroups)) {
        return options
      }

      _.each(this.missionSlotGroups, (slotGroup) => {
        options.push({
          value: slotGroup.orderNumber,
          text: `#${slotGroup.orderNumber} ${slotGroup.title}`
        })
      })

      return options
    },
    missionSlotGroups() {
      return this.$store.getters.missionSlotGroups
    },
    missionSlotTemplates() {
      return this.$store.getters.missionSlotTemplates
    }
  },
  methods: {
    applySlotTemplateToMission(slotTemplateUid) {
      this.hideMissionConvertToSlotTemplateModal()

      this.$store.dispatch('applySlotTemplateToMission', { missionSlug: this.$route.params.missionSlug, slotTemplateUid, insertAfter: this.missionSlotTemplateInsertAfter })
    },
    hideMissionConvertToSlotTemplateModal() {
      this.$refs.missionApplySlotTemplateModal.hide()
    },
    setMissionApplySlotTemplateData() {
      this.missionSlotTemplateFilter = null
      this.missionSlotTemplateInsertAfter = _.isNil(this.missionSlotGroups) || _.isEmpty(this.missionSlotGroups) ? 0 : _.last(this.missionSlotGroups).orderNumber
    }
  }
}
</script>
