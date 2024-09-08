import { Product } from '@renderer/common/types'
import { Routes } from '@renderer/common/utils/routes'
import { HtmlHTMLAttributes, useState } from 'react'
import { toast, Toaster } from 'sonner'
import { Link } from 'wouter'
import { deleteProductById } from '../services'

interface Props extends HtmlHTMLAttributes<HTMLTableElement> {
  data: object[]
  className?: string
  itemsPerPage?: number
  setDeleted: (state: boolean) => void
}

export default function Table({ data, className, itemsPerPage = 10, setDeleted }: Props) {
  const [currentPage, setCurrentPage] = useState(1)

  const properties = Object.keys(data[0])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem)

  // Calcula el número total de páginas
  const totalPages = Math.ceil(data.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleDeleteProduct = (id: string) => () => {
    toast.warning('This item would be deleted permantly, do you want to continue?', {
      duration: Infinity,
      action: {
        label: 'Eliminar',
        onClick: async () => {
          await deleteProductById(id)
          setDeleted(true)
        }
      }
    })
  }

  return (
    <div className="flex flex-col justify-between">
      <Toaster richColors position="top-right" />
      <table className={`w-full mt-5 text-center ${className && className}`}>
        <thead>
          <tr>
            {properties.map((x) => {
              if (x === 'id' || x === 'description') return null
              return <th key={`thead-${x}`}>{x}</th>
            })}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((x) => {
            const values = Object.entries(x).filter(
              ([key]) => key !== 'id' && key !== 'description'
            )
            return (
              <tr key={`tr-${JSON.stringify(x)}`}>
                {values.map(([, val]) => (
                  <td key={`${x}-${val}`}>{String(val)}</td>
                ))}
                <td className="flex gap-2 justify-center">
                  <Link to={`${Routes.addProduct}/${(x as Product).id}`}>Edit</Link>
                  <button onClick={handleDeleteProduct((x as Product).id)}>Delete</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="mt-10 flex justify-center">
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`mx-1 ${currentPage === index + 1 ? 'font-bold' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
