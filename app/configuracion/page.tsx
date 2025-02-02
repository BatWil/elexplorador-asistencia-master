"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

interface ConfigValues {
  biblePoints: number
  notebookPoints: number
  penPoints: number
  quizPoints: number
  groupGoal: number
}

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

export default function ConfigurationPage() {
  const router = useRouter()

  const [values, setValues] = useState<ConfigValues>({
    biblePoints: 3,
    notebookPoints: 2,
    penPoints: 1,
    quizPoints: 4,
    groupGoal: 630,
  })

  useEffect(() => {
    const savedConfig = localStorage.getItem("config")
    if (savedConfig) {
      setValues(JSON.parse(savedConfig))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const recalculateStudentPoints = (
    students: Student[],
    attendanceRecords: DailyAttendance[],
    newConfig: ConfigValues,
  ): Student[] => {
    return students.map((student) => {
      let totalPoints = 0
  
      attendanceRecords.forEach((dailyAttendance) => {
        const record = dailyAttendance.records.find((r) => r.studentId === student.id)
        if (record) {
          if (record.bible) totalPoints += newConfig.biblePoints
          if (record.notebook) totalPoints += newConfig.notebookPoints
          if (record.pen) totalPoints += newConfig.penPoints
          totalPoints += Math.min(record.quiz, newConfig.quizPoints) // Limita el valor de quiz
        }
      })
  
      return { ...student, points: totalPoints }
    })
  
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("config", JSON.stringify(values))

    const savedStudents = localStorage.getItem("students")
    const savedAttendance = localStorage.getItem("attendance")

    if (savedStudents && savedAttendance) {
      const students: Student[] = JSON.parse(savedStudents)
      const attendanceRecords: DailyAttendance[] = JSON.parse(savedAttendance)

      const updatedStudents = recalculateStudentPoints(students, attendanceRecords, values)

      localStorage.setItem("students", JSON.stringify(updatedStudents))
    }

    alert("Configuración guardada correctamente y puntos recalculados")
  }

  const handleLogout = () => {

    router.push("/login") // Redirige al login
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Configuración</h1>

      <Card>
        <CardHeader>
          <CardTitle>Valores del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="biblePoints">Puntos por Biblia</Label>
                <Input
                  id="biblePoints"
                  name="biblePoints"
                  type="number"
                  value={values.biblePoints}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notebookPoints">Puntos por Cuaderno

                </Label>
                <Input
                  id="notebookPoints"
                  name="notebookPoints"
                  type="number"
                  value={values.notebookPoints}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="penPoints">Puntos por Lapicero</Label>
                <Input
                  id="penPoints"
                  name="penPoints"
                  type="number"
                  value={values.penPoints}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quizPoints">Puntos Máximos por Cuestionario</Label>
                <Input
                  id="quizPoints"
                  name="quizPoints"
                  type="number"
                  value={values.quizPoints}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupGoal">Meta de Puntos del Grupo</Label>
              <Input
                id="groupGoal"
                name="groupGoal"
                type="number"
                value={values.groupGoal}
                onChange={handleInputChange}
              />
            </div>

            {/* BOTONES */}
            <div className="flex gap-2">
              <Button type="submit">Guardar Cambios</Button>
              <Button type="button" onClick={handleLogout} variant="destructive">
                <LogOut className="mr-2" />
                Cerrar Sesión
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
