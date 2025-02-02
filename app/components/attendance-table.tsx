import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface Student {
  id: number
  name: string
  present: boolean
  bible: boolean
  notebook: boolean
  pen: boolean
  quiz: number
}

interface Values {
  bible: number
  notebook: number
  pen: number
  quiz: number
}

interface AttendanceTableProps {
  students: Student[]
  updateStudent: (id: number, field: string, value: boolean | number) => void
  values: Values
}

export function AttendanceTable({ students, updateStudent, values }: AttendanceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Presente</TableHead>
          <TableHead>Biblia ({values.bible}pts)</TableHead>
          <TableHead>Cuaderno ({values.notebook}pts)</TableHead>
          <TableHead>Lapicero ({values.pen}pts)</TableHead>
          <TableHead>Cuestionario ({values.quiz}pts)</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>
              <Checkbox
                checked={student.present}
                onCheckedChange={(checked) => updateStudent(student.id, "present", checked as boolean)}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={student.bible}
                onCheckedChange={(checked) => updateStudent(student.id, "bible", checked as boolean)}
                disabled={!student.present}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={student.notebook}
                onCheckedChange={(checked) => updateStudent(student.id, "notebook", checked as boolean)}
                disabled={!student.present}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={student.pen}
                onCheckedChange={(checked) => updateStudent(student.id, "pen", checked as boolean)}
                disabled={!student.present}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={student.quiz}
                onChange={(e) => updateStudent(student.id, "quiz", Number.parseInt(e.target.value) || 0)}
                disabled={!student.present}
                className="w-16"
              />
            </TableCell>
            <TableCell>
              {student.present
                ? (student.bible ? values.bible : 0) +
                  (student.notebook ? values.notebook : 0) +
                  (student.pen ? values.pen : 0) +
                  student.quiz
                : 0}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

