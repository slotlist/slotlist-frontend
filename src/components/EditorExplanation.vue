<template>
  <div class="font-muted small">
    <b-popover :content="editorExplanationContent" :triggers="['click','focus']">
      <span>
        <i class="fa fa-question-circle-o" aria-hidden="true"></i> {{ $t('editor.explanation') }}
      </span>
    </b-popover>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  computed: {
    editorExplanationContent() {
      let content = '<img src="https://slotlist-info.storage.googleapis.com/images/static/editor-explanation.png" style="border: 1px solid #000000; padding: 0;"><br><br><ol>'
      _.times(8, (i) => {
        content += `<li>${this.$t('editor.explanation.' + (i + 1))}</li>`
      });
      content += `</ol><div class="text-center">${this.$t('editor.explanation.missing')}</div>`
      return content
    }
  }
}
</script>
