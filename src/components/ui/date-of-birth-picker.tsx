'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Label } from './label'

interface DateOfBirthPickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  required?: boolean
}

export function DateOfBirthPicker({ 
  value, 
  onChange, 
  placeholder = "Select your date of birth",
  required = false 
}: DateOfBirthPickerProps) {
  const [day, setDay] = useState<string>('')
  const [month, setMonth] = useState<string>('')
  const [year, setYear] = useState<string>('')

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      setDay(value.getDate().toString())
      setMonth((value.getMonth() + 1).toString())
      setYear(value.getFullYear().toString())
    }
  }, [value])

  // Generate arrays for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'))
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]
  
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString())

  // Handle date selection
  const handleDateChange = (type: 'day' | 'month' | 'year', val: string) => {
    let newDay = day
    let newMonth = month
    let newYear = year

    switch (type) {
      case 'day':
        newDay = val
        setDay(val)
        break
      case 'month':
        newMonth = val
        setMonth(val)
        break
      case 'year':
        newYear = val
        setYear(val)
        break
    }

    // Create date if all fields are filled
    if (newDay && newMonth && newYear) {
      try {
        const date = new Date(parseInt(newYear), parseInt(newMonth) - 1, parseInt(newDay))
        
        // Validate date (check if it's a valid date)
        if (date.getFullYear() === parseInt(newYear) && 
            date.getMonth() === parseInt(newMonth) - 1 && 
            date.getDate() === parseInt(newDay)) {
          onChange?.(date)
        } else {
          onChange?.(undefined)
        }
      } catch {
        onChange?.(undefined)
      }
    } else {
      onChange?.(undefined)
    }
  }

  // Get days for selected month (accounting for leap years)
  const getDaysInMonth = (month: string, year: string) => {
    if (!month || !year) return days
    
    const monthNum = parseInt(month)
    const yearNum = parseInt(year)
    
    if (monthNum === 2) {
      // February - check for leap year
      const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0)
      return Array.from({ length: isLeapYear ? 29 : 28 }, (_, i) => (i + 1).toString().padStart(2, '0'))
    } else if ([4, 6, 9, 11].includes(monthNum)) {
      // Months with 30 days
      return Array.from({ length: 30 }, (_, i) => (i + 1).toString().padStart(2, '0'))
    } else {
      // Months with 31 days
      return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'))
    }
  }

  const availableDays = getDaysInMonth(month, year)

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Date of Birth {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="grid grid-cols-3 gap-3">
        {/* Day */}
        <Select value={day} onValueChange={(val) => handleDateChange('day', val)} required={required}>
          <SelectTrigger className="w-full backdrop-blur-sm bg-white/50 dark:bg-black/50 border-white/20 hover:bg-white/70 dark:hover:bg-black/70">
            <SelectValue placeholder="Day">{day && day}</SelectValue>
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-white/90 dark:bg-black/90 border border-white/20 shadow-2xl rounded-xl max-h-48 overflow-y-auto">
            {availableDays.map((d) => (
              <SelectItem key={d} value={d} className="hover:bg-white/20 dark:hover:bg-black/20">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month */}
        <Select value={month} onValueChange={(val) => handleDateChange('month', val)} required={required}>
          <SelectTrigger className="w-full backdrop-blur-sm bg-white/50 dark:bg-black/50 border-white/20 hover:bg-white/70 dark:hover:bg-black/70">
            <SelectValue placeholder="Month">{month && months.find(m => m.value === month)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-white/90 dark:bg-black/90 border border-white/20 shadow-2xl rounded-xl max-h-48 overflow-y-auto">
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value} className="hover:bg-white/20 dark:hover:bg-black/20">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}
        <Select value={year} onValueChange={(val) => handleDateChange('year', val)} required={required}>
          <SelectTrigger className="w-full backdrop-blur-sm bg-white/50 dark:bg-black/50 border-white/20 hover:bg-white/70 dark:hover:bg-black/70">
            <SelectValue placeholder="Year">{year && year}</SelectValue>
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-white/90 dark:bg-black/90 border border-white/20 shadow-2xl rounded-xl max-h-48 overflow-y-auto">
            {years.map((y) => (
              <SelectItem key={y} value={y} className="hover:bg-white/20 dark:hover:bg-black/20">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {day && month && year && (
        <p className="text-xs text-muted-foreground">
          Selected: {months.find(m => m.value === month)?.label} {day}, {year}
        </p>
      )}
    </div>
  )
} 