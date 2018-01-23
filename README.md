# Fastify JWT Authz
### Created by Ethan Arrowood

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/) [![Build Status](https://travis-ci.org/Ethan-Arrowood/fastify-jwt-authz.svg?branch=master)](https://travis-ci.org/Ethan-Arrowood/fastify-jwt-authz)

`fastifyJWTAuthz` is a fastify plugin for verifying an authenticated `request.user` scope. Registering the plugin binds the `jwtAuthz` method to the fastify `request` instance. See the demo below on how to use the plugin.

```js
const fastify = require('fastify')()
const jwtAuthz = require('fastify-jwt-authz')

fastify.register(jwtAuthz)

fastify.get('/api', {
  beforeHandler: [
    function(request, reply, done) {
      // authenticate and bind `user` object to
      // the request instance
      // check out the fastify-jwt plugin!
    }, 
    function(request, reply, done) {
      request
        .jwtAuthz(['read:data', 'write:data'])
        .then(() => {
          fastify.log.info('valid scope')
          done()
        })
        .catch(err => {
          fastify.log.error(err)
          done(err)
        })
    },
  ],
}, (request, reply) => {
  fastify.log.info('reached API endpoint')
  reply.send({ userVerified: true })
})
```

`jwtAuthz` takes a list of scopes for verification. Additionally, it takes an optional callback parameter. It returns a promise otherwise.