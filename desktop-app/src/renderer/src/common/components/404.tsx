export default function View404() {
  const handleBack = () => {
    window.history.back()
  }
  return (
    <div className="text-white text-3xl h-full flex flex-col justify-center items-center gap-5">
      <h2>View not found</h2>
      <h3>404</h3>
      <button onClick={handleBack} className="underline">
        Go back Home
      </button>
    </div>
  )
}
