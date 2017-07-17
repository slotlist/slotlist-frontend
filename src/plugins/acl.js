import * as _ from 'lodash'

class ACL {
  can(permission, strict) {
    if (_.keys(this.permissions).length <= 0) {
      console.log("empty")
      return false
    } else if (_.has(this.permissions, '*')) {
      console.log("wildcard")
      return true
    }

    let perms = permission
    if (!_.isArray(permission)) {
      perms = [permission]
    }

    console.log("perms", perms)

    let foundPermissions =
      _.each(perms, (perm) => {
        if (this.hasPermission(this.permissions, perm)) {
          foundPermissions.push(perm)
        }
      })

    console.log("foundPermissions", foundPermissions)

    return strict ? foundPermissions.length === perms.length : foundPermissions.length > 0
  }

  hasPermission(perms, perm) {
    console.log("checking against", perms, perm)
    if (_.has(perms, perm)) {
      console.log("found", perm)
      return true
    } else {
      console.log("not found", perm)
      let permParts = perm
      if (_.isString(perm)) {
        permParts = perm.toLowerCase().split('.')
      }

      let previous = perms
      let part = permParts.shift()
      while (!_.isNil(part)) {
        console.log("checking direct", part, previous[part])
        let next = _.get(previous, part)
        if (_.isNil(next)) {
          console.log("checking wildcard", '*', previous['*'])
          next = _.get(previous, '*')
        }
        if (_.isNil(next)) {
          console.log("not found at all", part, previous)
        } else {
          console.log("found sth", part, next, permParts.length)
          if (permParts.length <= 0) {
            console.log("reached end", next, part)
            if (next === true) {
              console.log("found at end")
              return true
            }

            return false
          }

          return this.hasPermission(next, permParts)
        }

        previous = next
        part = permParts.shift()
      }
    }

    return false
  }

  get permissions() {
    return this._permissions || {}
  }

  parsePermissions(permissions) {
    this._permissions = {}

    if (!_.isArray(permissions) || _.isEmpty(permissions)) {
      return
    }

    _.each(permissions, (permission) => {
      const permissionParts = permission.toLowerCase().split('.')

      let previous = this._permissions
      let part = permissionParts.shift()
      while (!_.isNil(part)) {
        if (_.isNil(previous[part])) {
          previous[part] = permissionParts.length <= 0 ? true : {}
        }

        previous = previous[part]
        part = permissionParts.shift()
      }
    })
  }

  clearPermissions() {
    this._permissions = {}
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
  acl.clearPermissions()
  acl.router = router

  Vue.acl = acl
  Vue.prototype.$acl = acl
}

export default ACL
