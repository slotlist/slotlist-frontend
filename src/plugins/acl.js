import * as _ from 'lodash'

class ACL {
  can(permission, strict) {
    if (!_.isArray(permission)) {
      return _.indexOf(this.permissions, permission) >= 0
    }

    return _.intersection(this.permissions, permission).length >= (strict ? permission.length : 1)
  }

  get permissions() {
    return this._permissions || []
  }
  set permissions(permissions) {
    this._permissions = permissions || []
  }

  set router(router) {
    if (_.isNil(router) || !_.isFunction(router.beforeEach)) {
      return
    }

    router.beforeEach((to, from, next) => {
      if (_.isObject(to.meta) && !_.isNil(to.meta.permissions)) {
        const strict = _.isBoolean(to.meta.strictPermissions) ? to.meta.strictPermissions : false

        if (!this.can(to.meta.permissions, strict)) {
          return next(false)
        }
      }

      return next()
    })
  }
}

let acl = new ACL()

ACL.install = function (Vue, { router }) {
  acl.permissions = []
  acl.router = router

  Vue.acl = acl
  Vue.prototype.$acl = acl
}

export default ACL
