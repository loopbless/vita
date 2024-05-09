import { Server } from '@vita/core'
import trpcRouter from './routes/index.js'

const server = new Server()
server.trpc(trpcRouter)
server.listen(8086).then(() => {
  console.log('vita start listen 8086')
})