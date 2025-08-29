import { query } from "../../db/pool.ts";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function getAllTodos(): Promise<Todo[]> {
  return await query<Todo>(
    "SELECT * FROM todos ORDER BY created_at DESC",
  );
}

export async function createTodo(title: string): Promise<Todo> {
  const result = await query<Todo>(
    "INSERT INTO todos (title, completed) VALUES ($1, false) RETURNING *",
    [title],
  );

  return result[0];
}

export async function updateTodo(
  id: number,
  updates: Partial<Todo>,
): Promise<Todo | null> {
  const todo = await query<Todo>("SELECT * FROM todos WHERE id = $1", [id]);

  if (todo.length === 0) {
    return null;
  }

  const currentTodo = todo[0];
  const newCompleted = updates.completed !== undefined
    ? !currentTodo.completed
    : currentTodo.completed;

  const result = await query<Todo>(
    "UPDATE todos SET completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [newCompleted, id],
  );

  return result[0];
}

export async function deleteTodo(id: number): Promise<void> {
  await query("DELETE FROM todos WHERE id = $1", [id]);
}
