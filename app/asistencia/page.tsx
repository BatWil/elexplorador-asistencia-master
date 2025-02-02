"use client"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import toast from 'react-hot-toast';


interface Student {
  id: number
  name: string
  points: number
}

interface AttendanceRecord {
  studentId: number
  present: boolean
  bible: boolean
  notebook: boolean
  pen: boolean
  quiz: number
}

interface DailyAttendance {
  date: string
  records: AttendanceRecord[]
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<DailyAttendance[]>([])
  const [currentAttendance, setCurrentAttendance] = useState<AttendanceRecord[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [originalAttendance, setOriginalAttendance] = useState<AttendanceRecord[]>([])

  const getAttendanceForDate = useCallback(
    (date: Date): AttendanceRecord[] => {
      const formattedDate = format(date, "yyyy-MM-dd")
      const dailyAttendance = attendanceRecords.find((record) => record.date === formattedDate)
      if (dailyAttendance) {
        // Asegurarse de que todos los estudiantes actuales estén incluidos
        return students.map((student) => {
          const existingRecord = dailyAttendance.records.find((record) => record.studentId === student.id)
          return (
            existingRecord || {
              studentId: student.id,
              present: false,
              bible: false,
              notebook: false,
              pen: false,
              quiz: 0,
            }
          )
        })
      }
      // Si no hay asistencia para esta fecha, crear registros para todos los estudiantes
      return students.map((student) => ({
        studentId: student.id,
        present: false,
        bible: false,
        notebook: false,
        pen: false,
        quiz: 0,
      }))
    },
    [attendanceRecords],
  )

  useEffect(() => {
    const loadData = () => {
      const savedStudents = localStorage.getItem("students")
      const savedAttendance = localStorage.getItem("attendance")

      if (savedStudents) {
        setStudents(JSON.parse(savedStudents))
      }
      if (savedAttendance) {
        setAttendanceRecords(JSON.parse(savedAttendance))
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const existingAttendance = getAttendanceForDate(selectedDate)
    setCurrentAttendance(existingAttendance)
    setOriginalAttendance(JSON.parse(JSON.stringify(existingAttendance)))
    setIsEditing(false)
  }, [selectedDate, getAttendanceForDate])

  const updateAttendance = (studentId: number, field: keyof AttendanceRecord, value: boolean | number) => {
    if (!isEditing) return

    setCurrentAttendance((records) =>
      records.map((record) => (record.studentId === studentId ? { ...record, [field]: value } : record)),
    )
  }

  const calculatePointDifference = (oldRecord: AttendanceRecord, newRecord: AttendanceRecord) => {
    const pointValues = { bible: 3, notebook: 2, pen: 1 }
    let difference = 0

    for (const [key, value] of Object.entries(pointValues)) {
      if (oldRecord[key as keyof AttendanceRecord] !== newRecord[key as keyof AttendanceRecord]) {
        difference += newRecord[key as keyof AttendanceRecord] ? value : -value
      }
    }

    difference += newRecord.quiz - oldRecord.quiz

    return difference
  }

   const calculateTotalPoints = (attendance: AttendanceRecord) => {
    let points = 0
    if (attendance.present) {
      points += attendance.bible ? 3 : 0
      points += attendance.notebook ? 2 : 0
      points += attendance.pen ? 1 : 0
      points += attendance.quiz
    }
    return points
  } 




  const fetchData = async () => {
    // Implement your data fetching logic here
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const saveAttendance = () => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd")
    setAttendanceRecords((records) => {
      const existingIndex = records.findIndex((record) => record.date === formattedDate)
      let updatedRecords
      if (existingIndex >= 0) {
        updatedRecords = records.map((record, index) =>
          index === existingIndex ? { date: formattedDate, records: currentAttendance } : record,
        )
      } else {
        updatedRecords = [...records, { date: formattedDate, records: currentAttendance }]
      }
      localStorage.setItem("attendance", JSON.stringify(updatedRecords))
      return updatedRecords
    })

    // Update student points
    setStudents((prevStudents) => {
      const updatedStudents = prevStudents.map((student) => {
        const oldAttendance = originalAttendance.find((record) => record.studentId === student.id)
        const newAttendance = currentAttendance.find((record) => record.studentId === student.id)
        if (oldAttendance && newAttendance) {
          const pointDifference = calculatePointDifference(oldAttendance, newAttendance)
          return { ...student, points: student.points + pointDifference }
        }
        // Si es un nuevo estudiante, solo sumar los puntos de la asistencia actual
        if (newAttendance) {
          const points = calculateTotalPoints(newAttendance)
          return { ...student, points: student.points + points }
        }
        return student
      })
      localStorage.setItem("students", JSON.stringify(updatedStudents))
      return updatedStudents
    })

    setOriginalAttendance(JSON.parse(JSON.stringify(currentAttendance)))
    setIsEditing(false)

    const myPromise = fetchData();

    toast.promise(myPromise, {
      loading: 'Loading',
      success: 'Asistencias Guardada Correctamente',
      error: 'Error: No se pudo guardar la asistencia',
    });

  }

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setCurrentAttendance(JSON.parse(JSON.stringify(originalAttendance)))
    setIsEditing(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Registro de Asistencia</h1>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">{format(selectedDate, "EEEE d", { locale: es })}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date)
                    setIsEditing(false)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {isEditing ? (
            <>
              <Button onClick={saveAttendance}>Guardar Asistencia</Button>
              <Button variant="outline" onClick={cancelEditing}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={startEditing}>Editar</Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asistencia para {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Presente</TableHead>
                <TableHead>Biblia</TableHead>
                <TableHead>Cuaderno</TableHead>
                <TableHead>Lapicero</TableHead>
                <TableHead>Cuestionario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const attendance = currentAttendance.find((record) => record.studentId === student.id) || {
                  studentId: student.id,
                  present: false,
                  bible: false,
                  notebook: false,
                  pen: false,
                  quiz: 0,
                }
                return (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={attendance.present}
                        onCheckedChange={(checked) => updateAttendance(student.id, "present", checked as boolean)}
                        disabled={!isEditing}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={attendance.bible}
                        onCheckedChange={(checked) => updateAttendance(student.id, "bible", checked as boolean)}
                        disabled={!isEditing || !attendance.present}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={attendance.notebook}
                        onCheckedChange={(checked) => updateAttendance(student.id, "notebook", checked as boolean)}
                        disabled={!isEditing || !attendance.present}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={attendance.pen}
                        onCheckedChange={(checked) => updateAttendance(student.id, "pen", checked as boolean)}
                        disabled={!isEditing || !attendance.present}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={attendance.quiz}
                        onChange={(e) => updateAttendance(student.id, "quiz", Number.parseInt(e.target.value) || 0)}
                        disabled={!isEditing || !attendance.present}
                        className="w-16"
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

