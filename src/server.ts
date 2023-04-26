import { fastify } from 'fastify'

const app = fastify()

app.get('/hello', async (req, res) => {
  return res.send('Vinicius')
})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP server running'))
