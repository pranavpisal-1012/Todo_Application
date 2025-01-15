export interface User {
  id: string
  name: string
  photoUrl?: string
}

export interface CustomList {
  id: string
  name: string
  color: string
}

export interface Todo {
  id: string
  title: string
  completed: boolean
  important: boolean
  dueDate?: Date
  reminder?: Date
  notes?: string
  steps?: TodoStep[]
  listId?: string
}

export interface TodoStep {
  id: string
  title: string
  completed: boolean
}

