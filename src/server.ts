import { Router } from './router.ts'
import todoRouter from './features/todos/router.ts'
import { loggerMw } from './middleware/logger.ts'

const app = new Router()

app.use(loggerMw)
app.use(todoRouter)

const PORT = Number(Deno.env.get('PORT') ?? 8000)

console.log(`🚀 Deno API listening at http://localhost:${PORT}`)

const abortController = new AbortController()

Deno.addSignalListener('SIGINT', () => {
  console.log('\n🛑 Shutting down server...')
  abortController.abort()
})

try {
  Deno.serve({
    port: PORT,
    signal: abortController.signal,
  }, (req) => app.handle(req))
} catch (error) {
  if (error instanceof Deno.errors.Http) {
    console.log('Server closed')
  } else {
    console.error('Server error:', error)
  }
}
