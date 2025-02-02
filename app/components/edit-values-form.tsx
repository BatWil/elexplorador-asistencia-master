import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Values {
  bible: number
  notebook: number
  pen: number
  quiz: number
}

interface EditValuesFormProps {
  values: Values
  setValues: (values: Values) => void
  goal: number
  setGoal: (goal: number) => void
  onSave: (values: Values, goal: number) => void
}

export function EditValuesForm({ values, setValues, goal, setGoal, onSave }: EditValuesFormProps) {
  const [localValues, setLocalValues] = useState(values)
  const [localGoal, setLocalGoal] = useState(goal)

  const handleChange = (field: keyof Values, value: number) => {
    setLocalValues({ ...localValues, [field]: value })
  }

  const handleSave = () => {
    setValues(localValues)
    setGoal(localGoal)
    onSave(localValues, localGoal)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Editar Valores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bible">Biblia</Label>
          <Input
            id="bible"
            type="number"
            value={localValues.bible}
            onChange={(e) => handleChange("bible", Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notebook">Cuaderno</Label>
          <Input
            id="notebook"
            type="number"
            value={localValues.notebook}
            onChange={(e) => handleChange("notebook", Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pen">Lapicero</Label>
          <Input
            id="pen"
            type="number"
            value={localValues.pen}
            onChange={(e) => handleChange("pen", Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quiz">Cuestionario</Label>
          <Input
            id="quiz"
            type="number"
            value={localValues.quiz}
            onChange={(e) => handleChange("quiz", Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal">Meta de Puntos</Label>
          <Input
            id="goal"
            type="number"
            value={localGoal}
            onChange={(e) => setLocalGoal(Number.parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <Button onClick={handleSave}>Guardar Cambios</Button>
    </div>
  )
}

