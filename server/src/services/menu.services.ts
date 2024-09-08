import xlsx from 'xlsx'

import { Product, ProductRequestDto } from '../models/Product'
import { ReturnTuple } from '../types'
import db from '../utils/db'

const ProductCollection = db.collection('products')

export function getXlsxDataInJson(
  buffer: Buffer
): ReturnTuple<ProductRequestDto[]> {
  try {
    const workbook = xlsx.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const jsonData = xlsx.utils.sheet_to_json(sheet) as ProductRequestDto[]

    const parsedData: ProductRequestDto[] = jsonData.map(x => {
      if (
        !x.name ||
        !x.price ||
        !x.description ||
        x.showInScreen === undefined ||
        x.showInScreen === null
      )
        throw new Error('Invalid excel format')
      return {
        name: x.name.trim(),
        price: x.price,
        description: x.description.trim(),
        showInScreen: x.showInScreen
      }
    })

    return [null, parsedData]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function storeMenu(
  products: ProductRequestDto[]
): Promise<ReturnTuple<Product[]>> {
  try {
    //Delete all the products in order to insert the new menu
    await ProductCollection.deleteMany({})

    const { insertedCount } = await ProductCollection.insertMany(products)
    if (insertedCount > 0) {
      const products = await ProductCollection.find({}).toArray()
      const productsParsed: Product[] = products.map(x => ({
        id: x._id,
        name: x.name,
        price: x.price,
        description: x.description,
        showInScreen: x.showInScreen
      }))

      return [null, productsParsed]
    }

    throw new Error('Data not inserted')
  } catch (error) {
    return [error as Error, null]
  }
}
