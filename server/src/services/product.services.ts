import { ObjectId } from 'mongodb'
import { Product, ProductRequestDto } from '../models/Product'
import { ReturnTuple } from '../types'
import db from '../utils/db'

const ProductCollection = db.collection('products')

export async function getAllProducts(): Promise<ReturnTuple<Product[]>> {
  try {
    const products = await ProductCollection.find({}).toArray()
    const productsParsed: Product[] = products.map(x => ({
      id: x._id,
      name: x.name.trim(),
      price: x.price,
      description: x.description.trim(),
      showInScreen: x.showInScreen
    }))
    return [null, productsParsed]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function getById(
  id: ObjectId
): Promise<ReturnTuple<Product | null>> {
  try {
    const result = await ProductCollection.findOne({ _id: id })
    if (!result) return [new Error('Product not found'), null]

    const { _id, ...rest } = result
    const productParsed = {
      id: _id,
      ...rest
    }
    return [null, productParsed as Product]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function createProduct(
  newProduct: ProductRequestDto
): Promise<ReturnTuple<Product | null>> {
  try {
    const result = await ProductCollection.insertOne(newProduct)
    const productCreated = await ProductCollection.findOne({
      _id: result.insertedId
    })
    if (!productCreated)
      throw new Error('Product intersert but unable to retrieve data')

    const { _id, ...rest } = productCreated
    return [
      null,
      {
        id: _id,
        ...rest
      } as Product
    ]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function updateProduct(
  id: ObjectId,
  updates: Partial<ProductRequestDto>
): Promise<ReturnTuple<Product | null>> {
  try {
    const result = await ProductCollection.updateOne(
      { _id: id },
      { $set: updates }
    )

    if (result.matchedCount === 0) {
      throw new Error('Product not found')
    }

    const updatedProduct = await ProductCollection.findOne({ _id: id })
    if (!updatedProduct) {
      return [new Error('Product intersert but unable to retrieve data'), null]
    }

    const { _id, ...rest } = updatedProduct
    return [null, { id: _id, ...rest } as Product]
  } catch (error) {
    return [error as Error, null]
  }
}

export async function deleteProduct(
  id: ObjectId
): Promise<ReturnTuple<Product>> {
  try {
    const productToDelete = await ProductCollection.findOne({ _id: id })
    if (!productToDelete) return [new Error('Product not found'), null]
    const result = await ProductCollection.deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return [new Error('Product not found'), null]
    }
    const { _id, ...rest } = productToDelete
    return [null, { id: _id, ...rest } as Product]
  } catch (error) {
    return [error as Error, null]
  }
}
