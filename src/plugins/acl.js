import * as _ from 'lodash'

class ACL {
  can(permission, strict = false, includeSuperadmin = true) {
    if (_.keys(this.permissions).length <= 0) {
      return false
    } else if (_.has(this.permissions, '*') && includeSuperadmin) {
      return true
    }

    let perms = permission
    if (!_.isArray(permission)) {
      perms = [permission]
    }

    const foundPermissions = _.filter(perms, (perm) => {
      return this._hasPermission(this.permissions, perm)
    })

    return strict ? foundPermissions.length === perms.length : foundPermissions.length > 0
  }

  get permissions() {
    return this._permissions || {}
  }
  get authenticated() {
    return this._authenticated || false
  }

  parsePermissions(permissions) {
    this._permissions = {}
    this._authenticated = true

    if (!_.isArray(permissions) || _.isEmpty(permissions)) {
      return
    }

    _.each(permissions, (permission) => {
      const permissionParts = permission.toLowerCase().split('.')

      let previous = this._permissions
      let part = permissionParts.shift()
      while (!_.isNil(part)) {
        if (_.isNil(previous[part])) {
          previous[part] = {}
        }

        previous = previous[part]
        part = permissionParts.shift()
      }
    })
  }

  clearPermissions() {
    this._permissions = {}
    this._authenticated = false
  }

  set router(router) {
    if (_.isNil(router) || !_.isFunction(router.beforeEach)) {
      return
    }

    router.beforeEach((to, from, next) => {
      if (_.isObject(to.meta)) {
        if (to.meta.authenticated === true && !this.authenticated) {
          return next(false)
        }

        if (!_.isNil(to.meta.permissions)) {
          const strict = _.isBoolean(to.meta.strictPermissions) ? to.meta.strictPermissions : false

          if (!this.can(to.meta.permissions, strict)) {
            return next(false)
          }
        }
      }

      return next()
    })
  }

  _hasPermission(perms, perm) {
    if (_.isNil(perms) || !_.isObject(perms) || _.keys(perms).length <= 0) {
      return false
    }

    if (_.has(perms, perm)) {
      return true
    }

    const found = _.some(perms, (next, current) => {
      const permParts = _.isString(perm) ? perm.toLowerCase().split('.') : perm

      const permPart = permParts.shift()
      if (current === '*' || current === permPart) {
        if (permParts.length <= 0) {
          return true
        }

        return this._hasPermission(next, _.clone(permParts))
      }

      return false
    })

    return found
  }
}

let acl = new ACL()

ACL.install = function (Vue, { router }) {
  acl.clearPermissions()
  acl.router = router

  Vue.acl = acl
  Vue.prototype.$acl = acl
}

export default ACL
