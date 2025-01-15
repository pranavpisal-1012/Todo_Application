"use client"

import { useState } from "react"
import { Calendar, ListTodo, Plus, Star, Users, Trash2, InfoIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTodo } from "@/context/todo-context"
import { cn } from "@/lib/utils"
import { ProgressCircle } from "./progress-circle"

export function Sidebar() {
  const { state, dispatch } = useTodo()
  const [newListName, setNewListName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#2E7D32")
  const [showAddList, setShowAddList] = useState(false)

  const navItems = [
    {
      view: 'all' as const,
      icon: ListTodo,
      label: 'All Tasks',
    },
    {
      view: 'today' as const,
      icon: Calendar,
      label: 'Today',
    },
    {
      view: 'important' as const,
      icon: Star,
      label: 'Important',
    },
    {
      view: 'planned' as const,
      icon: Calendar,
      label: 'Planned',
    },
    {
      view: 'assigned' as const,
      icon: Users,
      label: 'Assigned to me',
    },
  ]

  const handleAddList = () => {
    if (newListName.trim()) {
      dispatch({
        type: 'ADD_LIST',
        payload: { name: newListName.trim(), color: selectedColor }
      })
      setNewListName("")
      setSelectedColor("#2E7D32")
      setShowAddList(false)
    }
  }

  const totalTodos = state.todos.length
  const completedTodos = state.todos.filter(todo => todo.completed).length

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 transition-transform duration-200 ease-in-out",
      !state.isSidebarOpen && "-translate-x-full"
    )}>
      <div className="flex items-center gap-3 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-10 h-10 rounded-full overflow-hidden">
              {state.user.photoUrl ? (
                <img
                  src={state.user.photoUrl || "/placeholder.svg"}
                  alt={state.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#2E7D32] text-white flex items-center justify-center">
                  <span className="font-semibold">
                    {state.user.name.charAt(0)}
                  </span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => {
              const url = prompt("Enter photo URL:")
              if (url) {
                dispatch({ 
                  type: 'UPDATE_USER', 
                  payload: { photoUrl: url } 
                })
              }
            }}>
              Change Photo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const name = prompt("Enter new name:")
              if (name) {
                dispatch({ 
                  type: 'UPDATE_USER', 
                  payload: { name } 
                })
              }
            }}>
              Change Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <h1 className="font-semibold text-lg dark:text-white">
          Hey, {state.user.name}
        </h1>
      </div>
      
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.view}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              state.view === item.view && "bg-[#F5F8F5] dark:bg-gray-700"
            )}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: item.view })}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}

        {state.customLists.map((list) => (
          <div key={list.id} className="flex items-center">
            <Button
              variant="ghost"
              className="flex-1 justify-start"
              onClick={() => dispatch({ type: 'SET_VIEW', payload: list.id })}
            >
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: list.color }}
              />
              {list.name}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch({ type: 'DELETE_LIST', payload: list.id })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </nav>

      <Dialog open={showAddList} onOpenChange={setShowAddList}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Add list
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="list-name">List Name</Label>
              <Input
                id="list-name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name"
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-2">
                {["#2E7D32", "#1976D2", "#D32F2F", "#FFA000"].map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-full",
                      selectedColor === color && "ring-2 ring-offset-2"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
            <Button onClick={handleAddList} className="w-full">
              Create List
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium dark:text-gray-300">Today Tasks</h2>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <InfoIcon className="h-4 w-4" />
          </Button>
        </div>
        <ProgressCircle
          total={totalTodos}
          completed={completedTodos}
        />
      </div>
    </aside>
  )
}

