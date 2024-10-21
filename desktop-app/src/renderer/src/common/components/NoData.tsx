export default function NoData({
  dataName,
  className
}: {
  dataName: string
  className?: string
}): React.JSX.Element {
  return (
    <div
      className={`flex items-center justify-center h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg my-5 ${className}`}
    >
      <h2 className="text-gray-500 text-xl italic">No {dataName} yet</h2>
    </div>
  )
}
