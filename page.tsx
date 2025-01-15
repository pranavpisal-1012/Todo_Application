import { TodoProvider } from "./context/todo-context"
import { Layout } from "./components/layout"

export default function TodoApp() {
  return (
    <TodoProvider>
      <Layout />
    </TodoProvider>
  )
}

