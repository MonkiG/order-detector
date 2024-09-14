import { useMemo, useState } from 'react'
import { Routes } from '../utils/routes'
import { Link } from 'wouter'

interface Props<T extends Record<string, any>> {
  data: T[]
  route: keyof typeof Routes
  handleDelete: (id: string) => () => void
  noShow?: Array<keyof T>
  dict?: Partial<Record<keyof T, string>>
  itemsPerPage?: number
}

/**
 * TODO:
 *  Corregir la posicion de las filas de la tabla
 * */

export default function Table<T extends Record<string, any>>({
  data,
  itemsPerPage = 10,
  dict,
  noShow,
  route,
  handleDelete
}: Props<T>) {
  const dataKeys = useMemo(() => {
    const firstObject = data[0]
    if (!firstObject) throw new Error('Undefined data')

    return Object.keys(firstObject) as Array<keyof T>
  }, [])

  const totalPages = useMemo(
    () => Math.ceil(data.length / itemsPerPage),
    [data.length, itemsPerPage]
  )
  const [currentPage, setCurrentPage] = useState(1)

  const currentData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const itemsToShow = data.slice(indexOfFirstItem, indexOfLastItem)

    return itemsToShow
  }, [data, itemsPerPage])

  const handlePageChange = (page: number) => () => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="flex flex-col justify-between">
      <table className="w-full mt-5 text-center">
        <thead>
          <tr>
            {dataKeys.map((x) =>
              noShow && noShow.includes(x) ? null : (
                <th key={`thead-${String(x)}`}>{(dict && dict[x]) || String(x)}</th>
              )
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((x) => (
            <tr key={`row-${x.id}`}>
              {Object.keys(x).map((key) =>
                noShow && noShow.includes(key) ? null : (
                  <td key={`row-${x.id}-value-${key}`}>
                    {typeof x[key] === 'boolean' || x[key] === 'true' || x[key] === 'false'
                      ? x[key]
                        ? 'Yes'
                        : 'No'
                      : x[key]}
                  </td>
                )
              )}
              <td className="flex gap-2 justify-center">
                <Link to={`/${route}/edit/${x.id}`}>Edit</Link>
                <button onClick={handleDelete(x.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}

interface PaginationProps {
  handlePageChange: (page: number) => () => void
  totalPages: number
  currentPage: number
}

const Pagination = ({ handlePageChange, totalPages, currentPage }: PaginationProps) => {
  return (
    <footer className="mt-10 flex justify-center">
      <button onClick={handlePageChange(currentPage - 1)}>Previous</button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`mx-1 ${currentPage === i + 1 ? 'font-bold' : ''}`}
          onClick={handlePageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={handlePageChange(currentPage + 1)}>Next</button>
    </footer>
  )
}
