interface EmblemProps {
  size?: number
}

export default function Emblem({ size = 40 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="8" className="fill-custom-2 dark:fill-custom-4" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        className="fill-custom-4 dark:fill-custom-2 font-heading"
        fontSize="18"
        fontWeight="bold"
      >
        F
      </text>
    </svg>
  )
}
