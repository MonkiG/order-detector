import { ObjectId } from 'mongodb'
import { ReturnTuple } from '../types'

export default function isValidId(id: string): ReturnTuple<ObjectId> {
  if (!ObjectId.isValid(id)) {
    return [new Error('Invalid id'), null]
  }

  return [null, new ObjectId(id)]
}
