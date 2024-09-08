import { MongoClient } from 'mongodb'
import { DATABASE_NAME, DATABASE_URL } from './config'

const client = new MongoClient(DATABASE_URL!)

;(async () => {
  try {
    await client.connect()
    console.log('Connected successfully')
  } catch (error) {
    console.log(error)
  }
})()

const db = client.db(DATABASE_NAME!)

export default db
