interface PhotoCardProps {
  imageSrc?: string
  title: string
  description: string
  bgClass?: string
  halftone?: boolean
}

export default function PhotoCard({
  imageSrc,
  title,
  description,
  bgClass,
  halftone,
}: PhotoCardProps) {
  return (
    <div
      className={[
        'relative rounded-xl overflow-hidden p-6',
        bgClass ?? 'bg-custom-4 dark:bg-custom-2',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {halftone && (
        <div className="absolute inset-0 bg-halftone opacity-10" />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="font-heading text-lg mb-2">{title}</h3>
      <p className="text-sm text-custom-3">{description}</p>
    </div>
  )
}
