'use strict'

var fp = require('fastify-plugin')

function fastifyJwtAuthz (fastify, opts, next) {
  fastify.decorateRequest('jwtAuthz', checkScopes)

  next()

  function checkScopes (scopes, callback) {
    var request = this
    if (callback === undefined) {
      return new Promise(function (resolve, reject) {
        request.jwtAuthz(scopes, function (err) {
          return err ? reject(err) : resolve(null)
        })
      })
    }

    if (scopes.length === 0) { return callback(new Error('Scopes cannot be empty')) }
    if (!this.user) { return callback(new Error('request.user does not exist')) }
    if (typeof this.user.scope !== 'string') { return callback(new Error('request.user.scope must be a string')) }

    var userScopes = this.user.scope.split(' ')
    var allowed = scopes.some(function (scope) {
      return userScopes.indexOf(scope) !== -1
    })

    return callback(allowed ? null : new Error('Insufficient scope'))
  }
}

module.exports = fp(fastifyJwtAuthz, {
  fastify: '>=1.0.0-rc.1',
  name: 'fastify-jwt-authz'
})
