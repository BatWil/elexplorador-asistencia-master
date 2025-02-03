"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Pencil, Trash2, Cake } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"

interface Student {
  id: number
  name: string
  age: number
  sex: "male" | "female"
  points: number
  birthDate: Date
}





export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [newStudent, setNewStudent] = useState<Omit<Student, "id" | "points">>({
    name: "",
    age: 0,
    sex: "male",
    birthDate: new Date(),
  })
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  useEffect(() => {
    const savedStudents = localStorage.getItem("students")
    //console.log("Estudiantes en localStorage al cargar:", savedStudents)
    
    if (savedStudents) {
      setStudents(
        JSON.parse(savedStudents, (key, value) => 
          key === "birthDate" ? new Date(value) : value
        )
      )
    }
  }, [])
  
  useEffect(() => {
    //console.log("Estado actualizado:", students)
  
    if (students.length > 0) {
      localStorage.setItem("students", JSON.stringify(students))
    }
    
    const total = students.reduce((sum, student) => sum + student.points, 0)
    setTotalPoints(total)
  }, [students])
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const { name, value } = e.target
    if (isEditing && editingStudent) {
      setEditingStudent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: name === "age" ? Number.parseInt(value) || 0 : value,
        };
      })
    } else {
      setNewStudent((prev) => ({
        ...prev,
        [name]: name === "age" ? Number.parseInt(value) || 0 : value,
      }))
    }
  }

  const handleSexChange = (value: "male" | "female", isEditing = false) => {
    if (isEditing && editingStudent) {
      setEditingStudent((prev) => {
        if (!prev) return prev;
        return { ...prev, sex: value };
      })
    } else {
      setNewStudent((prev) => ({ ...prev, sex: value }))
    }
  }

  const handleBirthDateChange = (date: Date | undefined, isEditing = false) => {
    if (date) {
      if (isEditing && editingStudent) {
        setEditingStudent((prev) => {
          if (!prev) return prev;
          return { ...prev, birthDate: date };
        })
      } else {
        setNewStudent((prev) => ({ ...prev, birthDate: date }))
      }
    }
  }

  const addNewStudent = () => {
    if (newStudent.name.trim() !== "") {
      const studentToAdd: Student = {
        id: Date.now(),
        ...newStudent,
        points: 0,
      }
      setStudents((prevStudents) => {
        const updatedStudents = [...prevStudents, studentToAdd]
        localStorage.setItem("students", JSON.stringify(updatedStudents))
        return updatedStudents
      })
      setNewStudent({ name: "", age: 0, sex: "male", birthDate: new Date() })
      setIsDialogOpen(false)
    }
  }

  const startEditing = (student: Student) => {
    setEditingStudent(student)
    setIsDialogOpen(true)
  }

  const saveEditedStudent = () => {
    if (editingStudent) {
      setStudents((prevStudents) => {
        const updatedStudents = prevStudents.map((student) =>
          student.id === editingStudent.id ? editingStudent : student,
        )
        localStorage.setItem("students", JSON.stringify(updatedStudents))
        return updatedStudents
      })
      setEditingStudent(null)
      setIsDialogOpen(false)
    }
  }

  const deleteStudent = (id: number) => {
    setStudents((prevStudents) => {
      const updatedStudents = prevStudents.filter((student) => student.id !== id)
      localStorage.setItem("students", JSON.stringify(updatedStudents))
      return updatedStudents
    })
  }

  const getBirthdaysThisMonth = () => {
    const currentMonth = new Date().getMonth()
    return students.filter((student) => student.birthDate.getMonth() === currentMonth)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Estudiantes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingStudent(null)
                setNewStudent({ name: "", age: 0, sex: "male", birthDate: new Date() })
                setIsDialogOpen(true)
              }}
            >
              Agregar Estudiante
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editingStudent ? editingStudent.name : newStudent.name}
                  onChange={(e) => handleInputChange(e, !!editingStudent)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">
                  Edad
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={editingStudent ? editingStudent.age : newStudent.age}
                  onChange={(e) => handleInputChange(e, !!editingStudent)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Sexo</Label>
                <RadioGroup
                  value={editingStudent ? editingStudent.sex : newStudent.sex}
                  onValueChange={(value: "male" | "female") => handleSexChange(value, !!editingStudent)}
                  className="col-span-3 flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Hombre</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Mujer</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthDate" className="text-right">
                  Fecha de Nacimiento
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <DatePicker
                    date={editingStudent ? editingStudent.birthDate : newStudent.birthDate}
                    onDateChange={(date) => handleBirthDateChange(date, !!editingStudent)}
                  />
                  <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
                    <Cake className="h-4 w-4" />
                    <span className="text-sm">
                      {format(editingStudent ? editingStudent.birthDate : newStudent.birthDate, "d 'de' MMMM yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={editingStudent ? saveEditedStudent : addNewStudent}>
              {editingStudent ? "Guardar Cambios" : "Agregar"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Fecha de Nacimiento</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.sex === "male" ? "Hombre" : "Mujer"}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Cake className="h-4 w-4" />
                      <span>{format(student.birthDate, "d 'de' MMMM yyyy", { locale: es })}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.points}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => startEditing(student)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => deleteStudent(student.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Puntos Totales del Grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalPoints} puntos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cumpleañeros del Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {getBirthdaysThisMonth().map((student) => (
              <li key={student.id} className="flex items-center space-x-2">
                <Cake className="h-4 w-4" />
                <span>
                  {student.name} - {format(student.birthDate, "d 'de' MMMM", { locale: es })}
                </span>
              </li>
            ))}
          </ul>
          {getBirthdaysThisMonth().length === 0 && <p>No hay cumpleañeros este mes.</p>}
        </CardContent>
      </Card>
    </div>
  )
}

