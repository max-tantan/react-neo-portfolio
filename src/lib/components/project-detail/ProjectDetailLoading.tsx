export default function ProjectDetailLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="w-full h-64 bg-custom-4 dark:bg-custom-2 rounded-xl" />
      <div className="h-8 w-2/3 bg-custom-4 dark:bg-custom-2 rounded" />
      <div className="h-4 w-full bg-custom-4 dark:bg-custom-2 rounded" />
      <div className="h-4 w-3/4 bg-custom-4 dark:bg-custom-2 rounded" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-custom-4 dark:bg-custom-2 rounded-full" />
        <div className="h-6 w-20 bg-custom-4 dark:bg-custom-2 rounded-full" />
        <div className="h-6 w-14 bg-custom-4 dark:bg-custom-2 rounded-full" />
      </div>
      <div className="border-t border-custom-4 dark:border-custom-2 pt-8 space-y-4">
        <div className="h-4 w-1/4 bg-custom-4 dark:bg-custom-2 rounded" />
        <div className="h-4 w-full bg-custom-4 dark:bg-custom-2 rounded" />
        <div className="h-4 w-full bg-custom-4 dark:bg-custom-2 rounded" />
        <div className="h-4 w-5/6 bg-custom-4 dark:bg-custom-2 rounded" />
      </div>
    </div>
  )
}
