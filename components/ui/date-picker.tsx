"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  date: Date
  onDateChange: (date: Date | undefined) => void
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState(format(date, "dd/MM/yyyy"))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.length === 10) {
      const parsedDate = parse(value, "dd/MM/yyyy", new Date())
      if (!isNaN(parsedDate.getTime())) {
        onDateChange(parsedDate)
      }
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const cursorPosition = input.selectionStart || 0

    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      let newPosition = cursorPosition

      if (e.key === "ArrowRight") {
        if (cursorPosition === 2 || cursorPosition === 5) {
          newPosition += 1
        }
      } else if (e.key === "ArrowLeft") {
        if (cursorPosition === 3 || cursorPosition === 6) {
          newPosition -= 1
        }
      }

      input.setSelectionRange(newPosition, newPosition)
    } else if (e.key >= "0" && e.key <= "9") {
      if (cursorPosition === 2 || cursorPosition === 5) {
        input.setSelectionRange(cursorPosition + 1, cursorPosition + 1)
      }
    }
  }

  React.useEffect(() => {
    setInputValue(format(date, "dd/MM/yyyy"))
  }, [date])

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      className="w-[120px]"
      placeholder="DD/MM/YYYY"
    />
  )
}

