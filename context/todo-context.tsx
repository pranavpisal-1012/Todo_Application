"use client"

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { Todo, TodoStep, User, CustomList } from '@/types/todo'

interface TodoState {
  todos: Todo[]
  selectedTodo: Todo | null
  view: 'all' | 'today' | 'important' | 'planned' | 'assigned'
  searchQuery: string
  isDarkMode: boolean
  isGridView: boolean
  isSidebarOpen: boolean
  user: User
  customLists: CustomList[]
  showCalendar: boolean
  showNotifications: boolean
  notifications: Notification[]
}

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: Date
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'TOGGLE_IMPORTANT'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'SELECT_TODO'; payload: Todo | null }
  | { type: 'ADD_STEP'; payload: { todoId: string; step: string } }
  | { type: 'TOGGLE_STEP'; payload: { todoId: string; stepId: string } }
  | { type: 'SET_DUE_DATE'; payload: { todoId: string; date: Date } }
  | { type: 'SET_REMINDER'; payload: { todoId: string; date: Date } }
  | { type: 'UPDATE_NOTES'; payload: { todoId: string; notes: string } }
  | { type: 'SET_VIEW'; payload: TodoState['view'] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_GRID_VIEW' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_LIST'; payload: { name: string; color: string } }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'TOGGLE_CALENDAR' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'createdAt'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'REFRESH_TODOS' }

const initialTodos: Todo[] = [
  { id: "1", title: "Buy groceries", completed: false, important: false },
  { id: "2", title: "Finish project report", completed: false, important: true },
  { id: "3", title: "Call the bank", completed: false, important: false },
  { id: "4", title: "Schedule dentist appointment", completed: false, important: false },
  { id: "5", title: "Plan weekend trip", completed: false, important: false },
  { id: "6", title: "Read a book", completed: true, important: false },
  { id: "7", title: "Clean the house", completed: true, important: false },
  { id: "8", title: "Prepare presentation", completed: true, important: false },
  { id: "9", title: "Update blog", completed: true, important: false },
]

const initialState: TodoState = {
  todos: initialTodos,
  selectedTodo: null,
  view: 'today',
  searchQuery: '',
  isDarkMode: false,
  isGridView: false,
  isSidebarOpen: true,
  user: {
    id: '1',
    name: 'ABCD',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop'
  },
  customLists: [],
  showCalendar: false,
  showNotifications: false,
  notifications: [
    {
      id: '1',
      title: 'Task Completed',
      message: 'You completed "Read a book"',
      read: false,
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'New Task Due',
      message: 'Task "Buy groceries" is due today',
      read: false,
      createdAt: new Date()
    }
  ]
}

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      const newTodo: Todo = {
        id: Date.now().toString(),
        title: action.payload,
        completed: false,
        important: false,
      }
      return {
        ...state,
        todos: [...state.todos, newTodo],
      }

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
        selectedTodo: state.selectedTodo?.id === action.payload
          ? { ...state.selectedTodo, completed: !state.selectedTodo.completed }
          : state.selectedTodo,
      }

    case 'TOGGLE_IMPORTANT':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, important: !todo.important }
            : todo
        ),
        selectedTodo: state.selectedTodo?.id === action.payload
          ? { ...state.selectedTodo, important: !state.selectedTodo.important }
          : state.selectedTodo,
      }

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        selectedTodo: state.selectedTodo?.id === action.payload ? null : state.selectedTodo,
      }

    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
        selectedTodo: state.selectedTodo?.id === action.payload.id
          ? action.payload
          : state.selectedTodo,
      }

    case 'SELECT_TODO':
      return {
        ...state,
        selectedTodo: action.payload,
      }

    case 'ADD_STEP':
      const newStep: TodoStep = {
        id: Date.now().toString(),
        title: action.payload.step,
        completed: false,
      }
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.todoId
            ? { ...todo, steps: [...(todo.steps || []), newStep] }
            : todo
        ),
        selectedTodo: state.selectedTodo?.id === action.payload.todoId
          ? { ...state.selectedTodo, steps: [...(state.selectedTodo.steps || []), newStep] }
          : state.selectedTodo,
      }

    case 'TOGGLE_STEP':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.todoId
            ? {
                ...todo,
                steps: todo.steps?.map(step =>
                  step.id === action.payload.stepId
                    ? { ...step, completed: !step.completed }
                    : step
                ),
              }
            : todo
        ),
        selectedTodo: state.selectedTodo?.id === action.payload.todoId
          ? {
              ...state.selectedTodo,
              steps: state.selectedTodo.steps?.map(step =>
                step.id === action.payload.stepId
                  ? { ...step, completed: !step.completed }
                  : step
              ),
            }
          : state.selectedTodo,
      }

    case 'SET_DUE_DATE':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.todoId
            ? { ...todo, dueDate: action.payload.date }
            : todo
        ),
        selectedTodo: state.selectedTodo?.id === action.payload.todoId
          ? { ...state.selectedTodo, dueDate: action.payload.date }
          : state.selectedTodo,
      }

    case 'SET_REMINDER':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.todoId
            ? { ...todo, reminder: action.payload.date }
            : todo
        ),
        selectedTodo: state.selectedTodo?.id === action.payload.todoId
          ? { ...state.selectedTodo, reminder: action.payload.date }
          : state.selectedTodo,
      }

    case 'UPDATE_NOTES':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.todoId
            ? { ...todo, notes: action.payload.notes }
            : todo
        ),
        selectedTodo: state.selectedTodo?.id === action.payload.todoId
          ? { ...state.selectedTodo, notes: action.payload.notes }
          : state.selectedTodo,
      }
    case 'SET_VIEW':
      return {
        ...state,
        view: action.payload,
        selectedTodo: null,
      }

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      }

    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      }

    case 'TOGGLE_GRID_VIEW':
      return {
        ...state,
        isGridView: !state.isGridView,
      }

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen
      }

    case 'UPDATE_USER':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      }

    case 'ADD_LIST':
      const newList: CustomList = {
        id: Date.now().toString(),
        name: action.payload.name,
        color: action.payload.color
      }
      return {
        ...state,
        customLists: [...state.customLists, newList]
      }

    case 'DELETE_LIST':
      return {
        ...state,
        customLists: state.customLists.filter(list => list.id !== action.payload),
        todos: state.todos.filter(todo => todo.listId !== action.payload)
      }

    case 'TOGGLE_CALENDAR':
      return {
        ...state,
        showCalendar: !state.showCalendar,
        showNotifications: false
      }

    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        showNotifications: !state.showNotifications,
        showCalendar: false
      }

    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...action.payload,
        read: false,
        createdAt: new Date()
      }
      return {
        ...state,
        notifications: [newNotification, ...state.notifications]
      }

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      }

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      }

    case 'REFRESH_TODOS':
      return {
        ...state,
        todos: [...state.todos] // Trigger re-render
      }

    default:
      return state
  }
}

const TodoContext = createContext<{
  state: TodoState
  dispatch: React.Dispatch<TodoAction>
} | null>(null)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)

  // Handle dark mode
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.isDarkMode])

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  )
}

export function useTodo() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
}

