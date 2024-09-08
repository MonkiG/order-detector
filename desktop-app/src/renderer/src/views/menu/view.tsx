import ViewLayout from '@renderer/common/layouts/ViewLayout'
import { ChangeEvent, FormEvent, useRef } from 'react'
import { Toaster, toast } from 'sonner'
import { getMenuTemplate, uploadMenu } from './services'

export default function MenuView() {
  const formData = useRef(new FormData()).current
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleExcelTemplate = async (): Promise<void> => {
    const [error, blob] = await getMenuTemplate()
    if (error) {
      console.log(error)
      toast.error('Error getting the excel template try later')
      return
    }

    const url = window.URL.createObjectURL(blob)
    const aTag = document.createElement('a')
    aTag.href = url
    aTag.download = 'menu.xlsx'
    document.body.appendChild(aTag)
    aTag.click()
    aTag.remove()
    window.URL.revokeObjectURL(url)
    toast.success('Menu template downloaded successfully', { duration: Infinity })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.get('file')) {
      toast.error('You should upload the excel file')
      return
    }

    uploadMenu(formData)
      .then((res) => {
        const [error] = res
        if (error) {
          toast.error('Error downloading uploading the menu, try later')
          return
        }

        toast.success('Menu submitted successfully')
      })
      .finally(() => {
        inputFileRef.current!.value = ''
        formData.delete('file')
      })
  }

  const handleInputFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    const file = files![0]
    formData.append('file', file)
  }

  return (
    <ViewLayout
      viewTitle={
        <div className="flex items-center justify-center relative">
          <h2 className="text-center text-3xl font-bold">Add the menu via excel</h2>
          <span
            title="This would replace all the products"
            className="w-5 h-5 ml-5 absolute right-5 top-3 cursor-pointer text-sm border-2 border-red-500 text-red-500 border-solid rounded-full inline-flex items-center justify-center"
          >
            ?
          </span>
        </div>
      }
    >
      <Toaster position="top-right" richColors closeButton />

      <div className="h-fit">
        <header className="flex justify-end my-5">
          <button
            type="button"
            onClick={handleExcelTemplate}
            className="border-2 border-solid border-black rounded-md p-1 hover:bg-[rgba(0,0,0,.1)]"
          >
            Get the excel template
          </button>
        </header>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-5">
          <input
            type="file"
            name="file"
            accept=".xlsx, .xls"
            ref={inputFileRef}
            onChange={handleInputFileChange}
          />
          <button
            type="submit"
            className="border-2 border-solid border-black rounded-md p-1 hover:bg-[rgba(0,0,0,.1)]"
          >
            Upload the excel file
          </button>
        </form>
      </div>
    </ViewLayout>
  )
}
