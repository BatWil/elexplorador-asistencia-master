"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

import { Toaster } from "@/components/ui/toaster"	

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

<div><Toaster/></div>


export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<DailyAttendance[]>([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [averageAttendance, setAverageAttendance] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [weeklyData, setWeeklyData] = useState<any[]>([])

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
    const intervalId = setInterval(loadData, 5000) // Refresh data every 5 seconds

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (students.length > 0) {
      setTotalStudents(students.length)
      setTotalPoints(students.reduce((sum, student) => sum + student.points, 0))

      // Calculate overall progress (assuming 1000 points is 100%)
      const maxPoints = 1000 * students.length
      const currentPoints = students.reduce((sum, student) => sum + student.points, 0)
      setOverallProgress(Math.round((currentPoints / maxPoints) * 100))
    }
  }, [students])

  useEffect(() => {
    if (attendanceRecords.length > 0 && students.length > 0) {
      const totalAttendance = attendanceRecords.reduce((sum, day) => {
        return sum + day.records.filter((record) => record.present).length
      }, 0)
      const averageAttendance = (totalAttendance / (attendanceRecords.length * students.length)) * 100
      setAverageAttendance(Math.round(averageAttendance))

      // Prepare weekly data
      const weeklyData = attendanceRecords.slice(-4).map((day) => {
        const date = new Date(day.date)
        const weekNumber = `Semana ${Math.ceil(date.getDate() / 7)}`
        const attendance = (day.records.filter((record) => record.present).length / students.length) * 100
        const points = day.records.reduce((sum, record) => {
          return sum + (record.bible ? 5 : 0) + (record.notebook ? 3 : 0) + (record.pen ? 2 : 0) + record.quiz
        }, 0)
        return { name: weekNumber, asistencia: Math.round(attendance), puntos: points }
      })
      setWeeklyData(weeklyData)
    }
  }, [attendanceRecords, students])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAttendance}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="asistencia" fill="#8884d8" name="Asistencia (%)" />
              <Bar yAxisId="right" dataKey="puntos" fill="#82ca9d" name="Puntos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

