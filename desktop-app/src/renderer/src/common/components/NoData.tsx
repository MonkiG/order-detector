export default function NoData({
  dataName,
  className,
  type
}: {
  dataName: string
  className?: string
  type?: string
}): React.JSX.Element {
  return (
    <div
      className={`flex items-center justify-center h-48 ${type ? 'bg-[#f4d172]' : 'bg-white'} border-2 border-dashed border-gray-[#f4d172] rounded-lg my-5 ${className}`}
    >
      <h2 className="text-blacktext-xl italic">No {dataName} yet</h2>
    </div>
  )
}
