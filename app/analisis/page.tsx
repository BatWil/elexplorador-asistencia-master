"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalysisPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<DailyAttendance[]>([])
  const [performanceTrends, setPerformanceTrends] = useState<any[]>([])
  const [pointsDistribution, setPointsDistribution] = useState<any[]>([])
  const [attendancePatterns, setAttendancePatterns] = useState<any[]>([])

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
    if (attendanceRecords.length > 0 && students.length > 0) {
      // Calculate performance trends
      const trends = attendanceRecords.map((day) => {
        const date = new Date(day.date)
        const attendance = (day.records.filter((record) => record.present).length / students.length) * 100
        const points = day.records.reduce((sum, record) => {
          return sum + (record.bible ? 5 : 0) + (record.notebook ? 3 : 0) + (record.pen ? 2 : 0) + record.quiz
        }, 0)
        const participation =
          (day.records.filter((record) => record.bible || record.notebook || record.pen || record.quiz > 0).length /
            students.length) *
          100
        return {
          name: `${date.getMonth() + 1}/${date.getDate()}`,
          asistencia: Math.round(attendance),
          puntos: points,
          participacion: Math.round(participation),
        }
      })
      setPerformanceTrends(trends)

      // Calculate points distribution
      const totalPoints = students.reduce((sum, student) => sum + student.points, 0)
      const distribution = [
        {
          name: "Biblia",
          value: attendanceRecords.reduce((sum, day) => sum + day.records.filter((r) => r.bible).length, 0) * 5,
        },
        {
          name: "Cuaderno",
          value: attendanceRecords.reduce((sum, day) => sum + day.records.filter((r) => r.notebook).length, 0) * 3,
        },
        {
          name: "Lapicero",
          value: attendanceRecords.reduce((sum, day) => sum + day.records.filter((r) => r.pen).length, 0) * 2,
        },
        {
          name: "Cuestionario",
          value: attendanceRecords.reduce((sum, day) => sum + day.records.reduce((s, r) => s + r.quiz, 0), 0),
        },
      ]
      const otherPoints = Math.max(0, totalPoints - distribution.reduce((sum, item) => sum + item.value, 0))
      distribution.push({
        name: "Otros",
        value: otherPoints,
      })
      setPointsDistribution(distribution)

      // Calculate attendance patterns
      const patterns = [0, 1, 2, 3, 4, 5, 6].map((day) => {
        const dayName = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][day]
        const dayAttendance = attendanceRecords.filter((record) => new Date(record.date).getDay() === day)
        const attendanceRate =
          dayAttendance.length > 0
            ? (dayAttendance.reduce((sum, record) => sum + record.records.filter((r) => r.present).length, 0) /
                (dayAttendance.length * students.length)) *
              100
            : 0
        return { name: dayName, asistencia: Math.round(attendanceRate) }
      })
      setAttendancePatterns(patterns)
    }
  }, [attendanceRecords, students])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Análisis</h1>

      <Card>
        <CardHeader>
          <CardTitle>Tendencias de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="asistencia" stroke="#8884d8" name="Asistencia (%)" />
              <Line type="monotone" dataKey="puntos" stroke="#82ca9d" name="Puntos" />
              <Line type="monotone" dataKey="participacion" stroke="#ffc658" name="Participación (%)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Puntos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pointsDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pointsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Patrones de Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendancePatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="asistencia" stroke="#8884d8" name="Asistencia (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

