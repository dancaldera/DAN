import { Router } from '../../router.ts'
import { createTodo, deleteTodo, getAllTodos, updateTodo } from './service.ts'

const todoRouter = new Router()

todoRouter.get('/', async (_request: Request): Promise<Response> => {
  const todos = await getAllTodos()
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Todo App - Deno + HTMX</title>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .todo-item { padding: 10px; border: 1px solid #ddd; margin: 5px 0; border-radius: 4px; }
            .completed { text-decoration: line-through; opacity: 0.6; }
            input, button { padding: 8px; margin: 5px; }
            button { cursor: pointer; }
            .delete-btn { background-color: #ff4444; color: white; border: none; border-radius: 4px; }
            .toggle-btn { background-color: #4CAF50; color: white; border: none; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h1>Todo App</h1>
        
        <form hx-post="/todos" hx-target="#todo-list" hx-swap="beforeend">
            <input type="text" name="title" placeholder="Add a new todo" required>
            <button type="submit">Add Todo</button>
        </form>
        
        <div id="todo-list">
            ${
    todos.map((todo) => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}" id="todo-${todo.id}">
                    <span>${todo.title}</span>
                    <button class="toggle-btn" hx-put="/todos/${todo.id}/toggle" hx-target="#todo-${todo.id}" hx-swap="outerHTML">
                        ${todo.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="delete-btn" hx-delete="/todos/${todo.id}" hx-target="#todo-${todo.id}" hx-swap="outerHTML">
                        Delete
                    </button>
                </div>
            `).join('')
  }
        </div>
    </body>
    </html>
  `

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
})

todoRouter.get('/todos', async (_request: Request): Promise<Response> => {
  const todos = await getAllTodos()
  return new Response(JSON.stringify(todos), {
    headers: { 'Content-Type': 'application/json' },
  })
})

todoRouter.post('/todos', async (request: Request): Promise<Response> => {
  const formData = await request.formData()
  const title = formData.get('title') as string

  if (!title) {
    return new Response('Title is required', { status: 400 })
  }

  const todo = await createTodo(title)

  const html = `
    <div class="todo-item" id="todo-${todo.id}">
        <span>${todo.title}</span>
        <button class="toggle-btn" hx-put="/todos/${todo.id}/toggle" hx-target="#todo-${todo.id}" hx-swap="outerHTML">
            Complete
        </button>
        <button class="delete-btn" hx-delete="/todos/${todo.id}" hx-target="#todo-${todo.id}" hx-swap="outerHTML">
            Delete
        </button>
    </div>
  `

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
})

todoRouter.put(
  '/todos/:id/toggle',
  async (request: Request): Promise<Response> => {
    const url = new URL(request.url)
    const id = parseInt(url.pathname.split('/')[2])

    const todo = await updateTodo(id, { completed: true })

    if (!todo) {
      return new Response('Todo not found', { status: 404 })
    }

    const html = `
    <div class="todo-item ${todo.completed ? 'completed' : ''}" id="todo-${todo.id}">
        <span>${todo.title}</span>
        <button class="toggle-btn" hx-put="/todos/${todo.id}/toggle" hx-target="#todo-${todo.id}" hx-swap="outerHTML">
            ${todo.completed ? 'Undo' : 'Complete'}
        </button>
        <button class="delete-btn" hx-delete="/todos/${todo.id}" hx-target="#todo-${todo.id}" hx-swap="outerHTML">
            Delete
        </button>
    </div>
  `

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  },
)

todoRouter.delete('/todos/:id', async (request: Request): Promise<Response> => {
  const url = new URL(request.url)
  const id = parseInt(url.pathname.split('/')[2])

  await deleteTodo(id)

  return new Response('', { status: 200 })
})

export default todoRouter
