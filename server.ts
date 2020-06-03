import { serve, Response, ServerRequest } from 'https://deno.land/std/http/server.ts'
import { delay } from 'https://deno.land/std/async/mod.ts'

import { router } from './routes.ts'
import { PrefilledResponse } from './router.ts'

const server = serve({ port: 8000 })
console.log('Server running on http://localhost:8000/')

async function handleRequest (req: ServerRequest) {
  const url = new URL(req.url, 'https://localhost')
  
  const res: Response = {}
  res.headers = new Headers()

  try {
    const route = router.match(url.pathname)
  
    if (route === null) {
      res.status = 404
      res.body = `Not found`
      req.respond(res)
      return
    }

    await route.handler(req, res as PrefilledResponse)
  } catch (err) {
    res.status = 500
    res.body = `Internal server error`
  }
}

for await (const req of server) {
  handleRequest(req)
}
