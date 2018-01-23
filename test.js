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

test('should throw an error "Scopes cannot be empty" with an empty scopes parameter', function (t) {
  t.plan(4)
  var fastify = Fastify()
  fastify.register(jwtAuthz)

  fastify.get('/test2', function (request, reply) {
    request.jwtAuthz([])
      .catch(err => t.match(err.message, 'Scopes cannot be empty'))
    reply.send({ foo: 'bar' })
  })
  fastify.listen(0, function (err) {
    fastify.server.unref()
    t.error(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test2',
      json: true
    }, function (err, response) {
      t.error(err)
      t.ok(response)
    })
  })
})

test('should throw an error "request.user does not exist" non existing request.user', function (t) {
  t.plan(4)
  var fastify = Fastify()
  fastify.register(jwtAuthz)

  fastify.get('/test3', function (request, reply) {
    request.jwtAuthz('baz')
      .catch(err => t.match(err.message, 'request.user does not exist'))
    reply.send({ foo: 'bar' })
  })
  fastify.listen(0, function (err) {
    fastify.server.unref()
    t.error(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test3',
      json: true
    }, function (err, response) {
      t.error(err)
      t.ok(response)
    })
  })
})

test('should throw an error "request.user.scope must be a string"', function (t) {
  t.plan(4)
  var fastify = Fastify()
  fastify.register(jwtAuthz)

  fastify.get('/test4', function (request, reply) {
    request.user = {
      name: 'sample',
      scope: 123
    }

    request.jwtAuthz('baz')
      .catch(err => t.match(err.message, 'request.user.scope must be a string'))
    reply.send({ foo: 'bar' })
  })
  fastify.listen(0, function (err) {
    fastify.server.unref()
    t.error(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test4',
      json: true
    }, function (err, response) {
      t.error(err)
      t.ok(response)
    })
  })
})

test('should throw an error "Insufficient scope"', function (t) {
  t.plan(4)
  var fastify = Fastify()
  fastify.register(jwtAuthz)

  fastify.get('/test5', function (request, reply) {
    request.user = {
      name: 'sample',
      scope: 'baz'
    }

    request.jwtAuthz(['foo'])
      .catch(err => t.match(err.message, 'Insufficient scope'))

    reply.send({ foo: 'bar' })
  })
  fastify.listen(0, function (err) {
    fastify.server.unref()
    t.error(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test5',
      json: true
    }, function (err, response) {
      t.error(err)
      t.ok(response)
    })
  })
})

test('should verify user scope', function (t) {
  t.plan(3)
  var fastify = Fastify()
  fastify.register(jwtAuthz)

  fastify.get('/test5', function (request, reply) {
    request.user = {
      name: 'sample',
      scope: 'user manager'
    }

    request.jwtAuthz(['user'])

    reply.send({ foo: 'bar' })
  })
  fastify.listen(0, function (err) {
    fastify.server.unref()
    t.error(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/test5',
      json: true
    }, function (err, response) {
      t.error(err)
      t.ok(response)
    })
  })
})
