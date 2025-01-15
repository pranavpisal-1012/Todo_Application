"use client"

import { useState } from "react"
import { Bell, Calendar, RotateCcw, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTodo } from "@/context/todo-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function TodoContent() {
  const { state, dispatch } = useTodo()
  const [newTodo, setNewTodo] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showQuickDate, setShowQuickDate] = useState(false)

  const addTodo = () => {
    if (newTodo.trim()) {
      dispatch({ 
        type: 'ADD_TODO', 
        payload: newTodo.trim() 
      })
      if (selectedDate) {
        dispatch({
          type: 'SET_DUE_DATE',
          payload: { todoId: Date.now().toString(), date: selectedDate }
        })
      }
      setNewTodo("")
      setSelectedDate(undefined)
    }
  }

  const resetNewTask = () => {
    setNewTodo("")
    setSelectedDate(undefined)
  }

  const filteredTodos = state.todos.filter(todo => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(state.searchQuery.toLowerCase())

    switch (state.view) {
      case 'all':
        return matchesSearch
      case 'today':
        return !todo.completed && matchesSearch
      case 'important':
        return todo.important && matchesSearch
      case 'planned':
        return todo.dueDate && matchesSearch
      case 'assigned':
        return matchesSearch
      default:
        if (state.customLists.find(list => list.id === state.view)) {
          return todo.listId === state.view && matchesSearch
        }
        return matchesSearch
    }
  })

  const incompleteTodos = filteredTodos.filter(todo => !todo.completed)
  const completedTodos = filteredTodos.filter(todo => todo.completed)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#F5F8F5] dark:bg-gray-800 rounded-lg p-4 mb-6">
        <Input
          type="text"
          placeholder="Add A Task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          className="bg-transparent border-none text-lg placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-400"
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={resetNewTask}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Popover open={showQuickDate} onOpenChange={setShowQuickDate}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col gap-2 p-2">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      setSelectedDate(tomorrow)
                      setShowQuickDate(false)
                    }}
                  >
                    Tomorrow
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      const nextWeek = new Date()
                      nextWeek.setDate(nextWeek.getDate() + 7)
                      setSelectedDate(nextWeek)
                      setShowQuickDate(false)
                    }}
                  >
                    Next week
                  </Button>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      setShowQuickDate(false)
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            {selectedDate && (
              <span className="text-sm text-muted-foreground">
                Due: {format(selectedDate, "MMM d")}
              </span>
            )}
            <Button 
              onClick={addTodo} 
              className="bg-[#2E7D32] hover:bg-[#1B5E20]"
            >
              ADD TASK
            </Button>
          </div>
        </div>
      </div>

      <div className={cn(
        "gap-4",
        state.isGridView ? "grid grid-cols-2" : "space-y-4"
      )}>
        {incompleteTodos.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              "flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer",
              state.isGridView && "flex-col items-start"
            )}
            onClick={() => dispatch({ type: 'SELECT_TODO', payload: todo })}
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1">
              <span className="dark:text-white">{todo.title}</span>
              {todo.dueDate && (
                <div className="text-sm text-muted-foreground mt-1">
                  Due: {format(todo.dueDate, "MMM d, yyyy")}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                dispatch({ type: 'TOGGLE_IMPORTANT', payload: todo.id })
              }}
            >
              <Star
                className={`h-4 w-4 ${
                  todo.important ? "fill-yellow-400 text-yellow-400" : ""
                }`}
              />
            </Button>
          </div>
        ))}

        {completedTodos.length > 0 && (
          <>
            <h2 className="font-medium mt-8 mb-4 dark:text-white">Completed</h2>
            <div className={cn(
              "gap-4",
              state.isGridView ? "grid grid-cols-2" : "space-y-4"
            )}>
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={cn(
                    "flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer",
                    state.isGridView && "flex-col items-start"
                  )}
                  onClick={() => dispatch({ type: 'SELECT_TODO', payload: todo })}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <span className="line-through text-gray-500 dark:text-gray-400">
                      {todo.title}
                    </span>
                    {todo.dueDate && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Due: {format(todo.dueDate, "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch({ type: 'TOGGLE_IMPORTANT', payload: todo.id })
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        todo.important ? "fill-yellow-400 text-yellow-400" : ""
                      }`}
                    />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

