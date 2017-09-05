import { i18n } from './app'
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
    document.title = `slotlist.info - ${i18n.t('title.browser')}`
  },
  setTitle(suffix) {
    document.title = `slotlist.info - ${suffix}`
  },
  slug(val) {
    return slugger(val)
  }
}
