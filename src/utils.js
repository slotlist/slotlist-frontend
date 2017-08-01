import slugger from 'slug'

slugger.charmap['.'] = '-'

slugger.defaults.modes.custom = {
  replacement: '-',
  symbols: true,
  remove: /[%]/g,
  lower: true,
  charmap: slugger.charmap,
  multicharmap: slugger.multicharmap
}

slugger.defaults.mode = 'custom'

export default {
  clearTitle() {
    document.title = 'slotlist.info - ArmA 3 mission and slotlist management'
  },
  setTitle(suffix) {
    document.title = `slotlist.info - ${suffix}`
  },
  slug(val) {
    return slugger(val)
  }
}
