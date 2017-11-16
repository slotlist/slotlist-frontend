<template>
  <b-form-group>
    <b-input-group class="date" :id="id" data-target-input="nearest">
      <b-form-input type="text" class="datetimerpicker-input" :data-target="`#${id}`"></b-form-input>
      <b-input-group-addon slot="right" :data-target="`#${id}`" data-toggle="datetimepicker">
        <i class="fa fa-calendar"></i>
      </b-input-group-addon>
    </b-input-group>
  </b-form-group>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment-timezone'

export default {
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: String,
      required: true
    },
    value: {
      default: '',
      validator(val) {
        return _.isNil(val) || _.isDate(val) || _.isString(val) || val instanceof moment
      }
    }
  },
  data() {
    return {
      dp: null,
      elem: null
    }
  },
  mounted: function() {
    if (!_.isNil(this.dp)) {
      return
    }

    const node = this.$el
    this.elem = window.jQuery(node).find(".date")

    this.elem.datetimepicker(this.config)

    this.dp = this.elem.data('datetimepicker')
    this.dp.date(this.value)
    this.elem.on('change.datetimepicker', this.onChange)
  },
  beforeDestroy: function() {
    if (!_.isNil(this.dp)) {
      this.dp.destroy()
      this.dp = null
      this.elem = null
    }
  },
  methods: {
    onChange(event) {
      const newDate = _.isNil(event.date) ? null : moment(event.date)

      this.$emit('input', newDate)
    }
  },
  watch: {
    config(val) {
      if (!_.isNil(this.dp)) {
        this.dp.options(_.assign({}, this.dp.options(), val))
      }
    },
    value(val) {
      if (!_.isNil(this.dp)) {
        this.dp.date(val || null)
      }
    }
  }
}
</script>
