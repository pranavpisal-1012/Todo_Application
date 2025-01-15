"use client"

import { Menu, Search, Grid, Moon, Sun, RotateCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sidebar } from "./sidebar"
import { TodoContent } from "./todo-content"
import { TodoDetails } from "./todo-details"
import { CalendarPopover } from "./calendar-popover"
import { NotificationsPopover } from "./notifications-popover"
import { useTodo } from "@/context/todo-context"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function Layout() {
  const { state, dispatch } = useTodo()
  
  return (
    <div className={`flex h-screen ${state.isDarkMode ? 'dark' : ''}`}>
      <Sidebar />
      <main className={cn(
        "flex-1 flex bg-[#F5F8F5] dark:bg-gray-900 transition-all duration-200 ease-in-out",
        state.isSidebarOpen ? "ml-64" : "ml-0"
      )}>
        <div className="flex-1 p-4 overflow-auto">
          <header className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="pl-8 w-64"
                  value={state.searchQuery}
                  onChange={(e) => 
                    dispatch({ 
                      type: 'SET_SEARCH_QUERY', 
                      payload: e.target.value 
                    })
                  }
                />
              </div>
              <CalendarPopover />
              <NotificationsPopover />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch({ type: 'REFRESH_TODOS' })}
              >
                <RotateCw className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch({ type: 'TOGGLE_GRID_VIEW' })}
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              >
                {state.isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </header>
          <TodoContent />
        </div>
        {state.selectedTodo && (
          <aside className="w-[400px] border-l bg-white dark:bg-gray-800 p-4">
            <TodoDetails todo={state.selectedTodo} />
          </aside>
        )}
      </main>
    </div>
  )
}

