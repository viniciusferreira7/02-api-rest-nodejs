import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'Hello node.js'
})

app.listen({
  port:3333
}).then(() => {
  console.log('HTTP Server Running')
})