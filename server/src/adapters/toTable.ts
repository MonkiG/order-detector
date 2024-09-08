import { Table } from '../models/Order'
import { ReturnTuple } from '../types'

const validTables: Table[] = Array.from({ length: 10 }).map(
  (_, i) => `T${i + 1}` as Table
)
export default function toTable(data: string): ReturnTuple<Table> {
  const dataToUpper = data.toUpperCase()

  if (!validTables.includes(dataToUpper as Table))
    return [new Error('Invalid table'), null]

  return [null, data as Table]
}
