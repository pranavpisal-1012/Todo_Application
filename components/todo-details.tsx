"use client"

import { useState } from "react"
import { Calendar, Plus, RotateCcw, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { useTodo } from "@/context/todo-context"
import { Todo } from "@/types/todo"
import { cn } from "@/lib/utils"

interface TodoDetailsProps {
  todo: Todo
}

export function TodoDetails({ todo }: TodoDetailsProps) {
  const { dispatch } = useTodo()
  const [newStep, setNewStep] = useState("")
  const [showCalendar, setShowCalendar] = useState(false)
  const [showRepeatOptions, setShowRepeatOptions] = useState(false)

  const handleAddStep = () => {
    if (newStep.trim()) {
      dispatch({
        type: 'ADD_STEP',
        payload: { todoId: todo.id, step: newStep.trim() }
      })
      setNewStep("")
    }
  }

  const repeatOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <Input
          type="text"
          value={todo.title}
          onChange={(e) => 
            dispatch({
              type: 'UPDATE_TODO',
              payload: { ...todo, title: e.target.value }
            })
          }
          className="text-lg border-none bg-transparent dark:text-white"
        />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: 'SELECT_TODO', payload: null })}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Input
              placeholder="Add step"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddStep()}
            />
            <Button onClick={handleAddStep}>Add</Button>
          </div>
          {todo.steps?.map((step) => (
            <div key={step.id} className="flex items-center gap-2 mt-2">
              <Checkbox
                checked={step.completed}
                onCheckedChange={() =>
                  dispatch({
                    type: 'TOGGLE_STEP',
                    payload: { todoId: todo.id, stepId: step.id }
                  })
                }
              />
              <span className={cn(
                "flex-1 dark:text-white",
                step.completed && "line-through text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {todo.dueDate
                ? `Due ${format(todo.dueDate, "MMM d, yyyy")}`
                : "Add Due Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2">
              <div className="flex flex-col gap-2 mb-2">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    const tomorrow = new Date()
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    dispatch({
                      type: 'SET_DUE_DATE',
                      payload: { todoId: todo.id, date: tomorrow }
                    })
                    setShowCalendar(false)
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
                    dispatch({
                      type: 'SET_DUE_DATE',
                      payload: { todoId: todo.id, date: nextWeek }
                    })
                    setShowCalendar(false)
                  }}
                >
                  Next week
                </Button>
              </div>
              <CalendarComponent
                mode="single"
                selected={todo.dueDate}
                onSelect={(date) => {
                  if (date) {
                    dispatch({
                      type: 'SET_DUE_DATE',
                      payload: { todoId: todo.id, date }
                    })
                    setShowCalendar(false)
                  }
                }}
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={showRepeatOptions} onOpenChange={setShowRepeatOptions}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Set Repeat
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-2">
              {repeatOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    // Here you would implement the repeat logic
                    setShowRepeatOptions(false)
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400">Add Notes</label>
          <Textarea
            placeholder="Add notes..."
            className="mt-2"
            value={todo.notes}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_NOTES',
                payload: { todoId: todo.id, notes: e.target.value }
              })
            }
          />
        </div>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Created Today</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600"
          onClick={() => {
            dispatch({ type: 'DELETE_TODO', payload: todo.id })
            dispatch({ type: 'SELECT_TODO', payload: null })
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

