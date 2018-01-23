# Fastify JWT Authz
### Created by Ethan Arrowood

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/) [![Build Status](https://travis-ci.org/Ethan-Arrowood/fastify-jwt-authz.svg?branch=master)](https://travis-ci.org/Ethan-Arrowood/fastify-jwt-authz)

`fastifyJWTAuthz` is a fastify plugin for verifying an authenticated `request.user` scope. Registering the plugin binds the `jwtAuthz` method to the fastify `request` instance. See the demo below on how to use the plugin.

```js
const fastify = require('fastify')()
const jwt = require('fastify-jwt')
const jwtAuthz = require('fastify-jwt-authz')

fastify.register(jwt, {
  secret: 'superSecretCode'
})
fastify.register(jwtAuthz)

fastify.get('/api', {
  beforeHandler: [
    function(request, reply, done) {
      request.jwtVerify(done)
      /* The user's JWT auth token is
       * connected to the request object 
       * under `headers.authentication`.
       * 
       * The jwtVerify method will verify 
       * the JWT token with the secret.
       * 
       * If it verifies, the user object is 
       * populated onto the request object 
       * which is passed to the next function.
       * */
    }, 
    function(request, reply, done) {
      request.jwtAuthz(['read:data', 'write:data'], done)
      /* jwtAuthz will read the verified user's
       * scope off of the request object. It will 
       * then compare the scopes defined above to
       * the user's scopes aquired by the JWT verification
       * method.
       * */
    },
  ],
}, (request, reply) => {
  fastify.log.info('reached API endpoint')
  reply.send({ userVerified: true })
})
```

`jwtAuthz` takes a list of scopes for verification. Additionally, it takes an optional callback parameter. It returns a promise otherwise.