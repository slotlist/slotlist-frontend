<template>
  <div style="position: relative" class="dropdown" :class="{'show': showDropdown}">
    <b-input-group>
      <b-input-group-addon slot="right" v-if="searchRunning" v-html="searchStatus"></b-input-group-addon>
      <b-form-input v-model="value" type="text" :placeholder="placeholder" autocomplete="off" @input="update" @keydown.up="up" @keydown.down="down" @keydown.enter="hit" @keydown.esc="reset" @blur="showDropdown = false" @focus="showDropdown = items.length > 0"></b-form-input>
    </b-input-group>
    <div class="dropdown-menu">
      <button type="button" class="dropdown-item" :class="{'active': isActive(index)}" v-for="(item, index) in items" :key="index" @mousedown.prevent="hit" @mousemove="setActive(index)" v-html="highlight(item.title, value)"></button>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  props: {
    limit: {
      type: Number,
      default: 10
    },
    action: {
      type: String
    },
    actionIndicator: {
      type: String
    },
    minCharacters: {
      type: Number,
      default: 3
    },
    onHit: {
      type: Function,
      default(items) {
        this.reset()
        this.value = items
      }
    },
    placeholder: {
      type: String,
      default: null
    },
    initialValue: {
      type: String,
      default: null
    }
  },
  created: function() {
    if (!_.isNil(this.initialValue)) {
      this.value = this.initialValue
    }
  },
  data() {
    return {
      showDropdown: false,
      current: 0,
      items: [],
      value: ''
    }
  },
  computed: {
    searchRunning() {
      return this.$store.getters[this.actionIndicator]
    },
    searchStatus() {
      return '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>'
    }
  },
  methods: {
    update() {
      if (!this.value) {
        this.reset()
        return false
      }

      if (this.value.length < this.minCharacters) {
        return
      }

      this.query()
    },
    query: _.debounce(function() {
      this.$store.dispatch(this.action, this.value)
        .then((results) => {
          this.items = results.slice(0, this.limit)
          this.showDropdown = this.items.length > 0
        })
    }, 500),
    reset() {
      this.items = []
      this.value = ''
      this.loading = false
      this.showDropdown = false
    },
    setActive(index) {
      this.current = index
    },
    isActive(index) {
      return this.current === index
    },
    hit(e) {
      e.preventDefault()
      this.value = this.items[this.current].title
      this.onHit(this.items[this.current], this)
      this.showDropdown = false
    },
    up() {
      if (this.current > 0) this.current--
    },
    down() {
      if (this.current < this.items.length - 1) this.current++
    },
    highlight(title, val) {
      const escapedVal = val.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      return title.replace(new RegExp('(' + escapedVal + ')', 'gi'), '<strong>$1</strong>')
    }
  }
}
</script>
