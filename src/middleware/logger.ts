export function loggerMw(request: Request): Response {
  const method = request.method
  const url = new URL(request.url)
  const path = url.pathname

  console.log(`${method} ${path} - ${new Date().toISOString()}`)

  return new Response('', { status: 200 })
}
