import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  current: number
  goal: number
}

export function ProgressBar({ current, goal }: ProgressBarProps) {
  const percentage = Math.min((current / goal) * 100, 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Progreso del grupo</span>
        <span>
          {current} / {goal} puntos
        </span>
      </div>
      <Progress value={percentage} className="w-full" />
    </div>
  )
}

