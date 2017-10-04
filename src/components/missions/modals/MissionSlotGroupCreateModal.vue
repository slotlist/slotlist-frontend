<template>
  <div>
    <b-modal id="missionSlotGroupCreateModal" ref="missionSlotGroupCreateModal" :title="$t('mission.modal.slotGroup.create')" @shown="clearMissionSlotGroupCreateData" no-close-on-backdrop>
      <div class="container-fluid">
        <b-form @submit.stop.prevent="createMissionSlotGroup">
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.title')" :state="missionSlotGroupCreateTitleState" :feedback="missionSlotGroupCreateTitleFeedback" :description="$t('mission.slotGroup.title.description')">
                <b-form-input v-model="missionSlotGroupCreateData.title" type="text" required></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.description.optional')" state="success" :description="$t('mission.slotGroup.description.description')">
                <b-form-input v-model="missionSlotGroupCreateData.description" type="text"></b-form-input>
              </b-form-fieldset>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-fieldset :label="$t('mission.slotGroup.insertAfter')" state="success" :description="$t('mission.slotGroup.insertAfter.description')">
                <b-form-select v-model="missionSlotGroupCreateData.insertAfter" :options="missionSlotGroupCreateInsertAfterOptions"></b-form-select>
              </b-form-fieldset>
            </div>
          </div>
        </b-form>
      </div>
      <div slot="modal-footer">
        <div class="btn-group" role="group" aria-label="Mission slot group create actions">
          <b-btn variant="success" @click="createMissionSlotGroup">
            <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.submit') }}
          </b-btn>
          <b-btn @click="hideMissionSlotGroupCreateModal">
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
      missionSlotGroupCreateData: {
        description: null,
        title: null,
        insertAfter: 0
      }
    }
  },
  computed: {
    missionSlotGroupCreateInsertAfterOptions() {
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
    missionSlotGroupCreateTitleFeedback() {
      return _.isString(this.missionSlotGroupCreateData.title) && !_.isEmpty(this.missionSlotGroupCreateData.title) ? '' : this.$t('mission.feedback.title.slotGroup')
    },
    missionSlotGroupCreateTitleState() {
      return _.isString(this.missionSlotGroupCreateData.title) && !_.isEmpty(this.missionSlotGroupCreateData.title) ? 'success' : 'danger'
    },
    missionSlotGroups() {
      return this.$store.getters.missionSlotGroups
    }
  },
  methods: {
    clearMissionSlotGroupCreateData() {
      this.missionSlotGroupCreateData = {
        description: null,
        title: null,
        insertAfter: _.isNil(this.missionSlotGroups) || _.isEmpty(this.missionSlotGroups) ? 0 : _.last(this.missionSlotGroups).orderNumber
      };
    },
    createMissionSlotGroup() {
      if (_.isEmpty(this.missionSlotGroupCreateData.title)) {
        return
      }

      if (_.isString(this.missionSlotGroupCreateData.description) && _.isEmpty(this.missionSlotGroupCreateData.description)) {
        this.missionSlotGroupCreateData.description = null
      }

      this.hideMissionSlotGroupCreateModal();

      this.$store.dispatch("createMissionSlotGroup", { missionSlug: this.$route.params.missionSlug, slotGroupDetails: this.missionSlotGroupCreateData })
    },
    hideMissionSlotGroupCreateModal() {
      this.$refs.missionSlotGroupCreateModal.hide();
    }
  }
}
</script>
