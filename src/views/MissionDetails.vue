<template>
  <div>
    <!-- Begin of content -->
    <div v-if="missionDetails">
      <div class="jumbotron">
        <h1 class="display-4 text-center">{{ missionDetails.title }}</h1>
        <h5 class="text-center">
          <span class="text-muted">{{ $t('mission.by') }}</span>
          <router-link :to="{name: 'userDetails', params: {userUid: missionDetails.creator.uid}}">{{ formatUserWithTag(missionDetails.creator) }}</router-link>
        </h5>
        <br>
        <div class="text-center" v-if="missionDetails.bannerImageUrl">
          <img :src="missionDetails.bannerImageUrl" style="max-width: 100%; max-height: 480px">
          <br><br>
        </div>
        <p class="lead text-justify">{{ missionDetails.description }}</p>
        <hr class="my-4">
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.community') }}</h5>
            <p>
              <router-link v-if="missionDetails.community" :to="{name: 'communityDetails', params: {communitySlug: missionDetails.community.slug}}">[{{ missionDetails.community.tag }}] {{ missionDetails.community.name }}</router-link>
              <span v-if="!missionDetails.community" class="text-muted font-italic">{{ $t('account.notAssociated') }}</span>
            </p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.requiredDLCs') }}</h5>
            <p>
              <span v-if="missionRequiredDLCs && missionRequiredDLCs.length > 0">
                <img v-for="requiredDLC in missionRequiredDLCs" :key="requiredDLC" :src="requiredDLC" width="24px" />
              </span>
              <span v-else class="text-muted font-italic">{{ $t('mission.requiredDLCs.none') }}</span>
            </p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.visibility') }}</h5>
            <p v-html="formattedMissionVisibility"></p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.slottingTime') }}</h5>
            <p>{{ formatDateTime(missionDetails.slottingTime) }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.startTime') }}</h5>
            <p>{{ formatDateTime(missionDetails.startTime) }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.endTime') }}
              <span class="text-muted">({{ $t('mission.abbr.estimated') }})</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.endTime) }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.briefingTime.short') }}
              <span class="text-muted">({{ $t('mission.abbr.leadership') }})</span>
            </h5>
            <p>{{ formatDateTime(missionDetails.briefingTime) }}</p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <b-btn variant="secondary" size="sm" :href="googleCalendarLink(missionDetails.slottingTime)" target="_blank">
              <i class="fa fa-calendar-plus-o" aria-hidden="true"></i> {{ $t('button.export.calendar.google') }}
            </b-btn>
            <b-btn variant="secondary" size="sm" @click="downloadICalFile(missionDetails.slottingTime)">
              <i class="fa fa-calendar" aria-hidden="true"></i> {{ $t('button.export.calendar.ical') }}
            </b-btn>
          </div>
          <div class="col-6 small" v-html="$t('mission.timezone', { timezone: timezone })"></div>
          <div class="col">
            <b-btn variant="secondary" size="sm" :href="googleCalendarLink(missionDetails.briefingTime)" target="_blank">
              <i class="fa fa-calendar-plus-o" aria-hidden="true"></i> {{ $t('button.export.calendar.google') }}
            </b-btn>
            <b-btn variant="secondary" size="sm" @click="downloadICalFile(missionDetails.briefingTime)">
              <i class="fa fa-calendar" aria-hidden="true"></i> {{ $t('button.export.calendar.ical') }}
            </b-btn>
          </div>
        </div>
        <br>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.gameServer') }}</h5>
            <div v-if="missionDetails.gameServer">
              <div class="row justify-content-center">
                <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.hostname') }}</div>
                <div class="col-4">{{ missionDetails.gameServer.hostname }}</div>
              </div>
              <div class="row justify-content-center">
                <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.port') }}</div>
                <div class="col-4">{{ missionDetails.gameServer.port }}</div>
              </div>
              <div class="row justify-content-center">
                <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.name') }}</div>
                <div class="col-4">
                  <span v-if="missionDetails.gameServer.name">{{ missionDetails.gameServer.name }}</span>
                  <span v-else class="text-muted font-italic">{{ $t('misc.notProvided') }}</span>
                </div>
              </div>
              <div class="row justify-content-center">
                <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.password') }}</div>
                <div class="col-4">
                  <span v-if="missionDetails.gameServer.password">{{ missionDetails.gameServer.password }}</span>
                  <span v-else class="text-muted font-italic">{{ $t('misc.notRequired') }}</span>
                </div>
              </div>
              <div class="row justify-content-center">
                <b-btn size="sm" v-clipboard:copy="gameServerHostnamePort">
                  <i class="fa fa-clipboard" aria-hidden="true"></i> {{ $t('button.copy') }}
                </b-btn>&nbsp;
                <b-btn size="sm" :href="`steam://connect/${missionDetails.gameServer.hostname}:${missionDetails.gameServer.port}${missionDetails.gameServer.password ? `/${missionDetails.gameServer.password}` : ''}`">
                  <i class="fa fa-sign-in" aria-hidden="true"></i> {{ $t('button.join') }}
                </b-btn>
              </div>
            </div>
            <p v-if="!missionDetails.gameServer" class="text-muted font-italic">{{ $t('misc.notProvided') }}</p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.voiceComms') }}</h5>
            <div v-if="missionDetails.voiceComms">
              <div class="row justify-content-center">
                <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.hostname') }}</div>
                <div class="col-4">{{ missionDetails.voiceComms.hostname }}</div>
              </div>
              <div class="row justify-content-center">
                <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.port') }}</div>
                <div class="col-4">{{ missionDetails.voiceComms.port }}</div>
              </div>
              <div class="row justify-content-center">
                <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.name') }}</div>
                <div class="col-4">
                  <span v-if="missionDetails.voiceComms.name">{{ missionDetails.voiceComms.name }}</span>
                  <span v-else class="text-muted font-italic">{{ $t('misc.notProvided') }}</span>
                </div>
              </div>
              <div class="row justify-content-center">
                <div class="col-4 font-weight-bold text-left">{{ $t('mission.serverInfo.password') }}</div>
                <div class="col-4">
                  <span v-if="missionDetails.voiceComms.password">{{ missionDetails.voiceComms.password }}</span>
                  <span v-else class="text-muted font-italic">{{ $t('misc.notRequired') }}</span>
                </div>
              </div>
              <div class="row justify-content-center">
                <b-btn size="sm" v-clipboard:copy="voiceCommsHostnamePort">
                  <i class="fa fa-clipboard" aria-hidden="true"></i> {{ $t('button.copy') }}
                </b-btn>&nbsp;
                <b-btn size="sm" :href="`ts3server://${missionDetails.voiceComms.hostname}?port=${missionDetails.voiceComms.port}${missionDetails.voiceComms.password ? `&password=${missionDetails.voiceComms.password}` : ''}`">
                  <i class="fa fa-sign-in" aria-hidden="true"></i> {{ $t('button.join') }}
                </b-btn>
              </div>
            </div>
            <p v-if="!missionDetails.voiceComms" class="text-center text-muted font-italic">{{ $t('misc.notProvided') }}</p>
          </div>
        </div>
        <br>
        <div class="row text-center">
          <div class="col">
            <h5>{{ $t('mission.techSupport') }}</h5>
            <p class="html ql-editor text-center" v-html="optionalTechSupport"></p>
          </div>
          <div class="col">
            <h5>{{ $t('mission.rules') }}</h5>
            <p class="html ql-editor text-center" v-html="optionalRules"></p>
          </div>
        </div>
        <div class="row text-center">
          <div class="col">
            <b-btn variant="primary" v-b-toggle.missionRepositoriesCollapse @click="fetchCommunityRepositories">
              <i class="fa fa-cubes" aria-hidden="true"></i> {{ $t('mission.repository.list') }}
            </b-btn>
            <b-collapse id="missionRepositoriesCollapse">
              <div v-if="missionDetails.repositories.length === 0">
                <br>
                <span class="font-italic text-muted">{{ $t('mission.repository.list.empty') }}</span>
              </div>
              <div v-for="(chunk, chunkIndex) in missionRepositoryChunks" :key="chunk">
                <br>
                <div class="row">
                  <div class="col" v-for="(missionRepository, index) in chunk" :key="missionRepository">
                    <div v-if="missionRepository.name" class="row justify-content-center">
                      <div class="col-4 font-weight-bold text-left">{{ $t('mission.repository.name') }}</div>
                      <div class="col-4 word-wrap">{{ missionRepository.name }}</div>
                    </div>
                    <div class="row justify-content-center">
                      <div class="col-4 font-weight-bold text-left">{{ $t('mission.repository.url') }}</div>
                      <div class="col-4 word-wrap">
                        <span v-if="missionRepository.url">
                          <a v-if="missionRepository.kind === 'arma3sync'" :href="missionRepository.url" @click.prevent="$copyText(missionRepository.url)">{{ missionRepository.url }}</a>
                          <a v-else :href="missionRepository.url">{{ missionRepository.url }}</a>
                        </span>
                        <span v-else class="text-muted font-italic">{{ $t('misc.notProvided') }}</span>
                      </div>
                    </div>
                    <div class="row justify-content-center">
                      <div class="col-4 font-weight-bold text-left">{{ $t('mission.repository.notes') }}</div>
                      <div class="col-4 word-wrap">
                        <span v-if="missionRepository.notes" v-html="missionRepository.notes"></span>
                        <span v-else class="text-muted font-italic">{{ $t('misc.notProvided') }}</span>
                      </div>
                    </div>
                    <div class="row justify-content-center">
                      <b-btn size="sm" v-clipboard:copy="missionRepository.url" :disabled="!missionRepository.url">
                        <i class="fa fa-clipboard" aria-hidden="true"></i> {{ $t('button.copy') }}
                      </b-btn>
                      <span v-if="isMissionEditor">&nbsp;</span>
                      <b-btn v-if="isMissionEditor" size="sm" variant="danger" @click="removeMissionRepository(chunkIndex * 2 + index)">
                        <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.remove') }}
                      </b-btn>
                    </div>
                  </div>
                  <div class="col" v-if="chunk.length === 1"></div>
                </div>
              </div>
              <div v-if="isMissionEditor">
                <br>
                <div class="row">
                  <div class="col-3">
                    <b-form-fieldset :label="$t('mission.repository.name.required')" :state="missionRepositoryCreateNameState" :feedback="missionRepositoryCreateNameFeedback" :description="$t('mission.repository.name.description')">
                      <b-form-input v-model="missionRepositoryCreateData.name" type="text"></b-form-input>
                    </b-form-fieldset>
                  </div>
                  <div class="col-3">
                    <b-form-fieldset :label="$t('mission.repository.kind')" :state="missionRepositoryCreateKindState" :feedback="missionRepositoryCreateKindFeedback" :description="$t('mission.repository.kind.description')">
                      <b-form-select v-model="missionRepositoryCreateData.kind" :options="missionRepositoryCreateKindOptions" class="mb-3"></b-form-select>
                    </b-form-fieldset>
                  </div>
                  <div class="col-3">
                    <b-form-fieldset :label="$t('mission.repository.url.optional')" :state="missionRepositoryCreateUrlState" :feedback="missionRepositoryCreateUrlFeedback" :description="$t('mission.repository.url.description')">
                      <b-form-input v-model="missionRepositoryCreateData.url" type="text"></b-form-input>
                    </b-form-fieldset>
                  </div>
                  <div class="col-3">
                    <b-form-fieldset :label="$t('mission.repository.notes.optional')" :state="missionRepositoryCreateNotesState" :feedback="missionRepositoryCreateNotesFeedback" :description="$t('mission.repository.notes.description')">
                      <b-form-input v-model="missionRepositoryCreateData.notes" textarea></b-form-input>
                    </b-form-fieldset>
                  </div>
                </div>
                <div class="row justify-content-center" v-if="communityRepositories && communityRepositories.length > 0">
                  <div class="col-6">
                    <b-form-fieldset :label="$t('community.repositories')" state="success" :description="$t('community.repositories.description')">
                      <b-form-select v-model="communityRepositoriesSelected" :options="communityRepositoryOptions" class="mb-3"></b-form-select>
                    </b-form-fieldset>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <b-btn size="sm" variant="success" @click="createMissionRepository">
                      <i class="fa fa-plus" aria-hidden="true"></i> {{ $t('button.add') }}
                    </b-btn>
                  </div>
                </div>
              </div>
            </b-collapse>
          </div>
        </div>
        <hr class="my-4" v-if="isMissionEditor">
        <div class="row justify-content-center" v-if="isMissionEditor">
          <b-btn variant="secondary" size="sm" v-b-modal.missionDuplicateModal>
            <i class="fa fa-files-o" aria-hidden="true"></i> {{ $t('button.duplicate.mission') }}
          </b-btn>&nbsp;
          <b-btn variant="secondary" size="sm" v-b-modal.missionConvertToSlotTemplateModal>
            <i class="fa fa-file-text-o" aria-hidden="true"></i> {{ $t('button.convert.slotTemplate') }}
          </b-btn>&nbsp;
          <b-btn variant="secondary" size="sm" v-if="isMissionCreator" v-b-modal.missionEmbedModal>
            <i class="fa fa-external-link" aria-hidden="true"></i> {{ $t('button.embed.mission') }}
          </b-btn>
        </div>
        <br v-if="isMissionEditor">
        <div class="row justify-content-center" v-if="isMissionEditor">
          <b-btn variant="primary" v-b-modal.missionEditModal @click="fetchCommunityServers">
            <i class="fa fa-edit" aria-hidden="true"></i> {{ $t('button.edit') }}
          </b-btn>&nbsp;
          <b-btn variant="primary" v-b-modal.missionBannerImageModal>
            <i class="fa fa-picture-o" aria-hidden="true"></i> {{ $t('button.edit.mission.bannerImage') }}
          </b-btn>&nbsp;
          <b-btn variant="primary" v-if="isMissionCreator" v-b-modal.missionPermissionModal>
            <i class="fa fa-key" aria-hidden="true"></i> {{ $t('button.edit.mission.permissions') }}
          </b-btn>
          <span v-if="isMissionCreator">&nbsp;</span>
          <b-btn variant="primary" v-if="isMissionEditor && isPrivateMission" v-b-modal.missionAccessModal>
            <i class="fa fa-user-secret" aria-hidden="true"></i> {{ $t('button.edit.mission.accesses') }}
          </b-btn>
          <span v-if="isMissionEditor && isPrivateMission">&nbsp;</span>
          <click-confirm v-if="isMissionCreator" yes-icon="fa fa-trash" yes-class="btn btn-danger" button-size="sm" :messages="{title: $t('mission.confirm.delete'), yes: $t('button.confirm'), no: $t('button.cancel')}">
            <b-btn variant="danger" @click="deleteMission">
              <i class="fa fa-trash" aria-hidden="true"></i> {{ $t('button.delete') }}
            </b-btn>
          </click-confirm>
        </div>
      </div>
      <div class="card">
        <div class="card-block text-nowrap">
          <div class="html ql-editor" v-html="missionDetails.detailedDescription"></div>
        </div>
      </div>
      <div v-if="missionDetails.collapsedDescription">
        <br>
        <div class="text-center">
          <b-btn variant="primary" v-b-toggle.missioncollapsedDescriptionCollapse @click="toggleMissioncollapsedDescription">
            <i class="fa" :class="{'fa-chevron-down': !isMissionCollapsedDescriptionExtended, 'fa-chevron-up': isMissionCollapsedDescriptionExtended}" aria-hidden="true"></i> {{ isMissionCollapsedDescriptionExtended ? $t('mission.collapsedDescription.toggle.close') : $t('mission.collapsedDescription.toggle.open') }}
          </b-btn>
        </div>
        <b-collapse id="missioncollapsedDescriptionCollapse">
          <br>
          <div class="card">
            <div class="card-block text-nowrap">
              <div class="html ql-editor" v-html="missionDetails.collapsedDescription"></div>
            </div>
          </div>
        </b-collapse>
      </div>
      <br>
      <div class="card">
        <div class="card-block text-nowrap">
          <h1>{{ $t('mission.slotlist') }}</h1>
          <div class="small">
            <b-form-group :label="$t('mission.slotlist.filter')" label-for="missionSlotlistFilter">
              <div role="group" id="missionSlotlistFilter">
                <b-form-checkbox v-model="missionSlotlistFilter" name="assigned" value="assigned">
                  {{ $t('mission.slotlist.filter.assigned') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="hasRegistrations" value="hasRegistrations">
                  {{ $t('mission.slotlist.filter.hasRegistrations') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="restricted" value="restricted">
                  {{ $t('mission.slotlist.filter.restricted') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="blocked" value="blocked">
                  {{ $t('mission.slotlist.filter.blocked') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistFilter" name="open" value="open">
                  {{ $t('mission.slotlist.filter.open') }}
                </b-form-checkbox>
              </div>
              <div class="group" id="missionSlotlistRequiredDLCsFilter" v-if="haveMissionSlotsAnyRequiredDLCs || (missionSlotlistRequiredDLCsFilter && missionSlotlistRequiredDLCsFilter.length > 0)">
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="aow" value="aow">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/aow.png" width="16px" alt="Art of War" /> {{ $t('mission.requiredDLCs.aow') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="apex" value="apex">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/apex.png" width="16px" alt="Apex" /> {{ $t('mission.requiredDLCs.apex') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="contact" value="contact">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/contact.png" width="16px" alt="Contact" /> {{ $t('mission.requiredDLCs.contact') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="csla" value="csla">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/csla.png" width="16px" alt="CSLA Iron Curtain" /> {{ $t('mission.requiredDLCs.csla') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="ef" value="ef">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/ef.png" width="16px" alt="Expeditionary Forces" /> {{ $t('mission.requiredDLCs.ef') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="gm" value="gm">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/gm.png" width="16px" alt="Global Mobilization" /> {{ $t('mission.requiredDLCs.gm') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="helicopters" value="helicopters">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/helicopters.png" width="16px" alt="Helicopters" /> {{ $t('mission.requiredDLCs.helicopters') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="jets" value="jets">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/jets.png" width="16px" alt="Jets" /> {{ $t('mission.requiredDLCs.jets') }}
                </b-form-checkbox>
                <br />
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="karts" value="karts">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/karts.png" width="16px" alt="Karts" /> {{ $t('mission.requiredDLCs.karts') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="laws-of-war" value="laws-of-war">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/laws-of-war.png" width="16px" alt="Laws of War" /> {{ $t('mission.requiredDLCs.laws-of-war') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="marksmen" value="marksmen">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/marksmen.png" width="16px" alt="Marksmen" /> {{ $t('mission.requiredDLCs.marksmen') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="rf" value="rf">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/rf.png" width="16px" alt="Reaction Forces" /> {{ $t('mission.requiredDLCs.rf') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="tac-ops" value="tac-ops">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/tac-ops.png" width="16px" alt="Tac-Ops" /> {{ $t('mission.requiredDLCs.tac-ops') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="tanks" value="tanks">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/tanks.png" width="16px" alt="Tanks" /> {{ $t('mission.requiredDLCs.tanks') }}
                </b-form-checkbox>
                <b-form-checkbox v-model="missionSlotlistRequiredDLCsFilter" name="vn" value="vn">
                  <img src="https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/vn.png" width="16px" alt="S.O.G. Prairie Fire" /> {{ $t('mission.requiredDLCs.vn') }}
                </b-form-checkbox>
              </div>
            </b-form-group>
          </div>
          <mission-slotlist></mission-slotlist>
        </div>
      </div>
    </div>
    <!-- End of content -->
    <!-- Begin of modals -->
    <div>
      <mission-access-modal v-if="loggedIn && isMissionEditor && isPrivateMission"></mission-access-modal>
      <mission-apply-slot-template-modal v-if="loggedIn && isMissionEditor"></mission-apply-slot-template-modal>
      <mission-banner-image-modal v-if="loggedIn && isMissionEditor"></mission-banner-image-modal>
      <mission-convert-to-slot-template-modal v-if="loggedIn"></mission-convert-to-slot-template-modal>
      <mission-duplicate-modal v-if="loggedIn && isMissionEditor"></mission-duplicate-modal>
      <mission-edit-modal v-if="loggedIn && isMissionEditor"></mission-edit-modal>
      <mission-permission-modal v-if="loggedIn && isMissionCreator"></mission-permission-modal>
      <mission-slot-assign-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-assign-modal>
      <mission-slot-create-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-create-modal>
      <mission-slot-details-modal></mission-slot-details-modal>
      <mission-slot-edit-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-edit-modal>
      <mission-slot-group-create-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-group-create-modal>
      <mission-slot-group-edit-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-group-edit-modal>
      <mission-slot-registration-modal v-if="loggedIn && !hasMissionEnded"></mission-slot-registration-modal>
      <mission-slot-selection-edit-modal v-if="loggedIn && isMissionEditor && !hasMissionEnded"></mission-slot-selection-edit-modal>
      <mission-embed-modal v-if="loggedIn && isMissionCreator"></mission-embed-modal>
    </div>
    <!-- End of modals -->
  </div>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'
import FileSaver from 'file-saver'
import MissionAccessModal from 'components/missions/modals/MissionAccessModal.vue'
import MissionApplySlotTemplateModal from 'components/missions/modals/MissionApplySlotTemplateModal.vue'
import MissionBannerImageModal from 'components/missions/modals/MissionBannerImageModal.vue'
import MissionConvertToSlotTemplateModal from 'components/missions/modals/MissionConvertToSlotTemplateModal.vue'
import MissionDuplicateModal from 'components/missions/modals/MissionDuplicateModal.vue'
import MissionEditModal from 'components/missions/modals/MissionEditModal.vue'
import MissionPermissionModal from 'components/missions/modals/MissionPermissionModal.vue'
import MissionSlotAssignModal from 'components/missions/modals/MissionSlotAssignModal.vue'
import MissionSlotCreateModal from 'components/missions/modals/MissionSlotCreateModal.vue'
import MissionSlotDetailsModal from 'components/missions/modals/MissionSlotDetailsModal.vue'
import MissionSlotEditModal from 'components/missions/modals/MissionSlotEditModal.vue'
import MissionSlotGroupCreateModal from 'components/missions/modals/MissionSlotGroupCreateModal.vue'
import MissionSlotGroupEditModal from 'components/missions/modals/MissionSlotGroupEditModal.vue'
import MissionSlotlist from 'components/missions/MissionSlotlist.vue'
import MissionSlotRegistrationModal from 'components/missions/modals/MissionSlotRegistrationModal.vue'
import MissionSlotSelectionEditModal from 'components/missions/modals/MissionSlotSelectionEditModal.vue'
import MissionEmbedModal from 'components/missions/modals/MissionEmbedModal.vue'
import utils from '../utils'

export default {
  components: {
    MissionAccessModal,
    MissionApplySlotTemplateModal,
    MissionBannerImageModal,
    MissionConvertToSlotTemplateModal,
    MissionDuplicateModal,
    MissionEditModal,
    MissionPermissionModal,
    MissionSlotAssignModal,
    MissionSlotCreateModal,
    MissionSlotDetailsModal,
    MissionSlotEditModal,
    MissionSlotGroupCreateModal,
    MissionSlotGroupEditModal,
    MissionSlotlist,
    MissionSlotRegistrationModal,
    MissionSlotSelectionEditModal,
    MissionEmbedModal
  },
  beforeCreate: function() {
    this.$store.dispatch('getMissionDetails', { missionSlug: this.$route.params.missionSlug })
    this.$store.dispatch('getMissionSlotlist', { missionSlug: this.$route.params.missionSlug })
  },
  created: function() {
    this.missionSlotlistFilter = this.$store.getters.missionSlotlistFilter
    this.missionSlotlistRequiredDLCsFilter = this.$store.getters.missionSlotlistRequiredDLCsFilter
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearMissionDetails')
    this.$store.dispatch('clearCommunityServers')
    this.$store.dispatch('clearCommunityRepositories')
  },
  data() {
    return {
      missionRepositoryCreateData: {
        name: null,
        kind: null,
        url: null,
        notes: null
      },
      missionRepositoryCreateKindOptions: [
        { text: this.$t('mission.repository.kind.arma3sync'), value: 'arma3sync' },
        { text: this.$t('mission.repository.kind.other'), value: 'other' }
      ],
      missionSlotlistFilter: [],
      missionSlotlistRequiredDLCsFilter: [],
      communityRepositoriesSelected: null,
      missionCollapsedDescriptionExtended: false,
      missionRepositoriesExtended: false
    }
  },
  computed: {
    communityRepositories() {
      return this.$store.getters.communityRepositories
    },
    communityRepositoryOptions() {
      if (_.isNil(this.communityRepositories) || _.isEmpty(this.communityRepositories)) {
        return []
      }

      let repositories = []
      _.each(this.communityRepositories, (repository, index) => {
        let kind = repository.kind === 'arma3sync' ? this.$t('mission.repository.kind.arma3sync') : this.$t('mission.repository.kind.other')
        repositories.push({
          text: `${kind} - ${repository.name} - ${repository.url ? repository.url : this.$t('mission.repository.url.empty') }`,
          value: index
        })
      })

      return repositories
    },
    formattedMissionVisibility() {
      switch (this.missionDetails.visibility) {
        case 'community':
          return `<span class="text-primary"><i class="fa fa-users" aria-hidden="true"></i> ${this.$t('mission.visibility.community')}</span>`
        case 'hidden':
          return `<span class="text-danger"><i class="fa fa-edit" aria-hidden="true"></i> ${this.$t('mission.visibility.hidden')}</span>`
        case 'private':
          return `<span class="text-warning"><i class="fa fa-user-secret" aria-hidden="true"></i> ${this.$t('mission.visibility.private')}</span>`
        case 'public':
          return `<span class="text-success"><i class="fa fa-globe" aria-hidden="true"></i> ${this.$t('mission.visibility.public')}</span>`
        default:
          return `<span class="text-muted font-italic"><i class="fa fa-question-circle" aria-hidden="true"></i> ${this.$t('mission.visibility.default')}</span>`
      }
    },
    gameServerHostnamePort() {
      return `${this.missionDetails.gameServer.hostname}:${this.missionDetails.gameServer.port}`
    },
    hasMissionEnded() {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      return moment().isAfter(moment(this.missionDetails.endTime))
    },
    haveMissionSlotsAnyRequiredDLCs() {
      if (_.isNil(this.missionSlotGroups)) {
        return false
      }

      return _.some(this.missionSlotGroups, (slotGroup) => {
        return _.some(slotGroup.slots, (slot) => {
          return !_.isEmpty(slot.requiredDLCs)
        })
      })
    },
    isCommunityMember() {
      if (_.isNil(this.user)) {
        return false
      } else if (_.isNil(this.user.community)) {
        return false
      } else if (_.isNil(this.missionDetails)) {
        return false
      } else if (_.isNil(this.missionDetails.community)) {
        return false
      }

      return this.user.community.slug === this.missionDetails.community.slug
    },
    isMissionCreator() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`])
    },
    isMissionEditor() {
      return this.$acl.can([`mission.${this.$route.params.missionSlug}.creator`, `mission.${this.$route.params.missionSlug}.editor`])
    },
    isMissionRepositoryUrlValid() {
      // Taken from: https://stackoverflow.com/a/5717133 @ 2017-08-04 09:43
      const urlPattern = /^((https?|ftp):\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
      return urlPattern.test(this.missionRepositoryCreateData.url)
    },
    isMissionCollapsedDescriptionExtended() {
      return this.missionCollapsedDescriptionExtended
    },
    isPrivateMission() {
      if (_.isNil(this.missionDetails)) {
        return false
      }

      return this.missionDetails.visibility === 'private'
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    missionDetails() {
      return this.$store.getters.missionDetails
    },
    missionRepositoryChunks() {
      if (_.isNil(this.missionDetails)) {
        return []
      }

      return _.chunk(this.missionDetails.repositories, 2);
    },
    missionRepositoryCreateKindFeedback() {
      return _.isEmpty(this.missionRepositoryCreateData.kind) ? this.$t('mission.feedback.repository.kind') : ''
    },
    missionRepositoryCreateKindState() {
      return _.isEmpty(this.missionRepositoryCreateData.kind) ? 'danger' : 'success'
    },
    missionRepositoryCreateNameFeedback() {
      return _.isEmpty(this.missionRepositoryCreateData.name) ? this.$t('mission.feedback.repository.name') : ''
    },
    missionRepositoryCreateNameState() {
      return _.isEmpty(this.missionRepositoryCreateData.name) ? 'danger' : 'success'
    },
    missionRepositoryCreateNotesFeedback() {
      if (_.isEmpty(this.missionRepositoryCreateData.url) && _.isEmpty(this.missionRepositoryCreateData.notes)) {
        return this.$t('mission.feedback.repository.urlOrNotes')
      }

      return ''
    },
    missionRepositoryCreateNotesState() {
      if (_.isEmpty(this.missionRepositoryCreateData.url) && _.isEmpty(this.missionRepositoryCreateData.notes)) {
        return 'danger'
      }

      return 'success'
    },
    missionRepositoryCreateUrlFeedback() {
      if (_.isEmpty(this.missionRepositoryCreateData.url) && _.isEmpty(this.missionRepositoryCreateData.notes)) {
        return this.$t('mission.feedback.repository.urlOrNotes')
      } else if (this.missionRepositoryCreateData.kind === 'arma3sync' && _.isEmpty(this.missionRepositoryCreateData.url)) {
        return this.$t('mission.feedback.repository.url.arma3sync')
      }  else if (_.isEmpty(this.missionRepositoryCreateData.url)) {
        return ''
      }

      return this.isMissionRepositoryUrlValid ? '' : this.$t('mission.feedback.repository.url')
    },
    missionRepositoryCreateUrlState() {
      if (_.isEmpty(this.missionRepositoryCreateData.url) && _.isEmpty(this.missionRepositoryCreateData.notes)) {
        return 'danger'
      } else if (this.missionRepositoryCreateData.kind === 'arma3sync' && _.isEmpty(this.missionRepositoryCreateData.url)) {
        return 'danger'
      } else if (_.isEmpty(this.missionRepositoryCreateData.url)) {
        return 'success'
      }

      return this.isMissionRepositoryUrlValid ? 'success' : 'danger'
    },
    missionRequiredDLCs() {
      if (_.isNil(this.missionDetails)) {
        return []
      }

      if (_.isEmpty(this.missionDetails.requiredDLCs)) {
        return []
      }

      return _.map(this.missionDetails.requiredDLCs, (requiredDLC) => {
        return `https://slotlist-info.storage.googleapis.com/images/static/dlc-icons/${requiredDLC.toLowerCase()}.png`
      })
    },
    missionSlotGroups() {
      return this.$store.getters.missionSlotGroups
    },
    optionalRules() {
      return this.missionDetails.rules || `<div class='text-muted font-italic'>${this.$t('misc.notSpecified')}</div>`
    },
    optionalTechSupport() {
      return this.missionDetails.techSupport || `<div class='text-muted font-italic'>${this.$t('misc.notProvided')}</div>`
    },
    user() {
      return this.$store.getters.user
    },
    timezone() {
      return this.$store.getters.timezone
    },
    voiceCommsHostnamePort() {
      return `${this.missionDetails.voiceComms.hostname}:${this.missionDetails.voiceComms.port}`
    }
  },
  methods: {
    createMissionRepository() {
      if (_.isEmpty(this.missionRepositoryCreateData.kind) || _.isEmpty(this.missionRepositoryCreateData.name)) {
        return
      } else if (_.isEmpty(this.missionRepositoryCreateData.url) && _.isEmpty(this.missionRepositoryCreateData.notes)) {
        return
      }

      const repositories = _.clone(this.missionDetails.repositories)
      repositories.push({
        name: this.missionRepositoryCreateData.name,
        kind: this.missionRepositoryCreateData.kind,
        url: _.isEmpty(this.missionRepositoryCreateData.url) ? null : this.missionRepositoryCreateData.url,
        notes: _.isEmpty(this.missionRepositoryCreateData.notes) ? null : this.missionRepositoryCreateData.notes,
      })

      this.$store.dispatch('editMission', {
        missionSlug: this.$route.params.missionSlug,
        updatedMissionDetails: {
          repositories
        },
        missionTitle: this.missionDetails.title
      })

      this.missionRepositoryCreateData = {
        name: null,
        kind: null,
        url: null,
        notes: null
      }

      this.communityRepositoriesSelected = null
    },
    deleteMission() {
      this.$store.dispatch('deleteMission', {
        missionSlug: this.$route.params.missionSlug,
        missionTitle: this.missionDetails.title
      })
    },
    downloadICalFile(beginTime) {
      let data = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//slotlist.info//slotlist-frontend v${process.env.FRONTEND_VERSION}//EN\r\n`
      data += `CALSCALE:GREGORIAN\r\nMETHOD:PUBLIC\r\nX-WR-CALNAME:slotlist.info\r\nX-ORIGINAL-URL:${process.env.BASE_URL}\r\n`
      data += `X-WR-CALDESC:${this.$t('title.browser')}\r\nBEGIN:VEVENT\r\n`
      data += `UID:${this.missionDetails.slug}@${process.env.BASE_URL}\r\n`
      data += `DTSTART;TZID=${this.$store.getters.timezone}:${moment(beginTime).format('YMMDD[T]HHmmss')}\r\n`
      data += `DTEND;TZID=${this.$store.getters.timezone}:${moment(this.missionDetails.endTime).format('YMMDD[T]HHmmss')}\r\n`
      data += `DTSTAMP:${moment().format('YMMDD[T]HHmmss')}\r\n`
      data += `SUMMARY:${this.missionDetails.title}\r\n`
      data += `DESCRIPTION:${this.$t('mission.details')}: ${process.env.BASE_URL}/missions/${this.missionDetails.slug} \\n \\n`
      data += `${this.$t('mission.times.ical', {
        start: this.formatDateTime(this.missionDetails.startTime),
        briefing: this.formatDateTime(this.missionDetails.briefingTime),
        slotting: this.formatDateTime(this.missionDetails.slottingTime),
        end: this.formatDateTime(this.missionDetails.endTime)
      })} \\n \\n`
      data += `${this.missionDetails.description}\r\n`
      data += `URL:${process.env.BASE_URL}/missions/${this.missionDetails.slug}\r\n`
      data += `END:VEVENT\r\nEND:VCALENDAR`

      const blob = new Blob([data], { type: 'text/calendar' })

      FileSaver.saveAs(blob, `${this.missionDetails.title}.ics`)
    },
    fetchCommunityRepositories() {
      this.missionRepositoriesExtended = !this.missionRepositoriesExtended

      if (this.missionRepositoriesExtended && this.isCommunityMember && _.isNil(this.$store.getters.communityRepositories)) {
        this.$store.dispatch('getCommunityRepositories', { communitySlug: this.user.community.slug })
      }

      this.communityRepositoriesSelected = null
    },
    fetchCommunityServers() {
      if (this.isCommunityMember && (_.isNil(this.$store.getters.communityGameServers) || _.isNil(this.$store.getters.communityVoiceComms))) {
        this.$store.dispatch('getCommunityServers', { communitySlug: this.user.community.slug })
      }
    },
    googleCalendarLink(beginTime) {
      let link = 'https://www.google.com/calendar/event?action=TEMPLATE'
      link += `&text=${this.missionDetails.title}`
      link += `&dates=${moment(beginTime).format('YMMDD[T]HHmmss')}/${moment(this.missionDetails.endTime).format('YMMDD[T]HHmmss')}`
      link += `&details=${this.$t('mission.details')}: ${process.env.BASE_URL}/missions/${this.missionDetails.slug} \n \n`
      link += `${this.$t('mission.times', {
        start: this.formatDateTime(this.missionDetails.startTime),
        briefing: this.formatDateTime(this.missionDetails.briefingTime),
        slotting: this.formatDateTime(this.missionDetails.slottingTime),
        end: this.formatDateTime(this.missionDetails.endTime)
      })} \n \n`
      link += `${this.missionDetails.description}`
      link += `&location&trp=false&ctx=${this.$store.getters.timezone}`

      return encodeURI(link)
    },
    removeMissionRepository(index) {
      const repositories = _.clone(this.missionDetails.repositories)
      repositories.splice(index, 1)

      this.$store.dispatch('editMission', {
        missionSlug: this.$route.params.missionSlug,
        updatedMissionDetails: {
          repositories
        },
        missionTitle: this.missionDetails.title
      })
    },
    toggleMissioncollapsedDescription() {
      this.missionCollapsedDescriptionExtended = !this.missionCollapsedDescriptionExtended
    }
  },
  watch: {
    missionSlotlistFilter(val) {
      this.$store.dispatch('filterMissionSlotlist', val)
    },
    missionSlotlistRequiredDLCsFilter(val) {
      this.$store.dispatch('filterMissionSlotlistRequiredDLCs', val)
    },
    communityRepositoriesSelected(val) {
      const repository = this.communityRepositories[val];
      if (_.isNil(repository)) {
        return
      }

      this.missionRepositoryCreateData.name = repository.name
      this.missionRepositoryCreateData.kind = repository.kind
      this.missionRepositoryCreateData.url = repository.url
      this.missionRepositoryCreateData.notes = repository.notes
    }
  }
}
</script>
