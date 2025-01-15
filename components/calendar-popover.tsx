import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTodo } from "@/context/todo-context"

export function CalendarPopover() {
  const { state, dispatch } = useTodo()

  const todosWithDueDate = state.todos.filter(todo => todo.dueDate)

  return (
    <Popover open={state.showCalendar} onOpenChange={() => dispatch({ type: 'TOGGLE_CALENDAR' })}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <CalendarIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={new Date()}
          modifiers={{
            booked: todosWithDueDate.map(todo => todo.dueDate!)
          }}
          modifiersStyles={{
            booked: {
              backgroundColor: '#2E7D32',
              color: 'white'
            }
          }}
          onDayClick={(date) => {
            // You could add functionality to show tasks due on this date
            console.log('Selected date:', date)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

