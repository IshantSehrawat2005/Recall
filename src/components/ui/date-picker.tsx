'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  required?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  required
}: DatePickerProps) {
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal backdrop-blur-sm bg-white/50 dark:bg-black/50 border-white/20 hover:bg-white/70 dark:hover:bg-black/70 rounded-lg transition-all duration-300",
              !value && "text-muted-foreground",
              className
            )}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        {required && (
          <input
            type="hidden"
            required={required}
            value={value ? value.toISOString().split('T')[0] : ''}
          />
        )}
      <PopoverContent className="w-auto p-3 backdrop-blur-xl bg-white/90 dark:bg-black/90 border border-white/20 shadow-2xl rounded-xl">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="bg-transparent"
          classNames={{
            months: "flex flex-col space-y-4",
            month: "space-y-3",
            caption: "flex justify-center pt-1 relative items-center text-foreground font-medium",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-md transition-all duration-200 hover:bg-white/20 dark:hover:bg-black/20"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-7 font-normal text-[0.7rem]",
            row: "flex w-full mt-1",
            cell: cn(
              "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
              "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            ),
            day: cn(
              "h-7 w-7 p-0 font-normal aria-selected:opacity-100 rounded-md transition-all duration-200 hover:bg-white/20 dark:hover:bg-black/20",
              "focus:bg-accent focus:text-accent-foreground text-xs"
            ),
            day_selected: cn(
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md"
            ),
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
      </Popover>
    </div>
  )
} 