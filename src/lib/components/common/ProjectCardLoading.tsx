export default function ProjectCardLoading() {
  return (
    <div className="p-6 rounded-xl border border-custom-4 dark:border-custom-2 animate-pulse">
      <div className="w-full h-36 bg-custom-4 dark:bg-custom-2 rounded-lg mb-4" />
      <div className="h-5 w-3/4 bg-custom-4 dark:bg-custom-2 rounded mb-2" />
      <div className="h-4 w-full bg-custom-4 dark:bg-custom-2 rounded mb-1" />
      <div className="h-4 w-2/3 bg-custom-4 dark:bg-custom-2 rounded mb-3" />
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-14 bg-custom-4 dark:bg-custom-2 rounded-full" />
        <div className="h-5 w-16 bg-custom-4 dark:bg-custom-2 rounded-full" />
        <div className="h-5 w-12 bg-custom-4 dark:bg-custom-2 rounded-full" />
      </div>
      <div className="h-3 w-1/2 bg-custom-4 dark:bg-custom-2 rounded" />
    </div>
  )
}
