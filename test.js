'use strict'

var test = require('tap').test
var Fastify = require('fastify')
var request = require('request')
var jwtAuthz = require('./fastify-jwt-authz')

test('should decorate request instance with jwtAuthz method', function (t) {
  t.plan(4)
  var fastify = Fastify()
  fastify.register(jwtAuthz)

  fastify.get('/test', function (request, reply) {
    t.ok(request.jwtAuthz)
    reply.send({ foo: 'bar' })
  })
  fastify.listen(0, function (err) {
    fastify.server.unref()
    t.error(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test',
      json: true
    }, function (err, response) {
      t.error(err)
      t.ok(response)
    })
  })
})