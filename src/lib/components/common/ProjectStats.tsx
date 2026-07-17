import { useCountUp } from '@/lib/hooks/useCountUp'

interface ProjectStatsProps {
  stars?: number
  forks?: number
  downloads?: number
}

function AnimatedStat({ label, value }: { label: string; value: number }) {
  const { count, ref } = useCountUp(value, 800)

  return (
    <span ref={ref} className="text-custom-3">
      {label}: <strong className="text-text">{count.toLocaleString()}</strong>
    </span>
  )
}

export default function ProjectStats({ stars, forks, downloads }: ProjectStatsProps) {
  return (
    <div className="flex gap-4 text-xs">
      {stars !== undefined && <AnimatedStat label="Stars" value={stars} />}
      {forks !== undefined && <AnimatedStat label="Forks" value={forks} />}
      {downloads !== undefined && <AnimatedStat label="Downloads" value={downloads} />}
    </div>
  )
}
