"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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

interface Config {
  groupGoal: number
}

export default function ProgressPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<DailyAttendance[]>([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [config, setConfig] = useState<Config>({ groupGoal: 1000 })

  useEffect(() => {
    const loadData = () => {
      const savedStudents = localStorage.getItem("students")
      const savedAttendance = localStorage.getItem("attendance")
      const savedConfig = localStorage.getItem("config")

      if (savedStudents) {
        setStudents(JSON.parse(savedStudents))
      }
      if (savedAttendance) {
        setAttendanceRecords(JSON.parse(savedAttendance))
      }
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    }

    loadData()
    const intervalId = setInterval(loadData, 5000) // Refresh data every 5 seconds

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (students.length > 0 && config.groupGoal > 0) {
      const totalPoints = students.reduce((sum, student) => sum + student.points, 0)
      setOverallProgress(Math.min(100, (totalPoints / config.groupGoal) * 100))
    }
  }, [students, config.groupGoal])

  const calculateStudentProgress = (student: Student) => {
    if (config.groupGoal > 0 && students.length > 0) {
      const individualGoal = config.groupGoal / students.length
      return Math.min(100, (student.points / individualGoal) * 100)
    }
    return 0
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Progreso General</h1>

      <Card>
        <CardHeader>
          <CardTitle>Progreso del Grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Progreso total</span>
              <span>{overallProgress.toFixed(2)}%</span>
            </div>
            <Progress
              value={overallProgress}
              className="h-4 w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progreso Individual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => {
              const progress = calculateStudentProgress(student)
              return (
                <div key={student.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{student.name}</span>
                    <span>{progress.toFixed(2)}%</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 w-full"
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

