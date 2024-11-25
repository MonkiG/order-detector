export default function NoData({
  dataName,
  className
}: {
  dataName: string
  className?: string
}): React.JSX.Element {
  return (
    <div
      className={`flex items-center justify-center h-48 ${dataName === 'products' ? 'bg-[#f4d172]' : 'bg-white'} border-2 border-dashed border-gray-[#f4d172] rounded-lg my-5 ${className}`}
    >
      <h2 className="text-blacktext-xl italic">No {dataName} yet</h2>
    </div>
  )
}
