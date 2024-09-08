import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'

import { getXlsxDataInJson, storeMenu } from '../services/menu.services'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = Router()

/**
 * This should store in the database all the menu products
 */
router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file
  if (!file || !file.originalname.endsWith('xlsx'))
    return res.status(400).json({
      message: 'Bad request',
      error: 'You should provide a excel file'
    })

  const [err, jsonData] = getXlsxDataInJson(file.buffer)
  if (err && err.message === 'Invalid excel format')
    return res.status(400).json({ message: 'Invalid excel format' })
  if (err)
    return res.status(500).json({ message: 'Server error', error: err.message })

  const [error, products] = await storeMenu(jsonData!)
  if (error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })

  return res.status(201).json(products)
})

router.get('/', (_, res) => {
  const filePath = path.join(__dirname, '../../public/menu-example.xlsx')

  res.sendFile(filePath, err => {
    if (err) {
      res.status(500).send('Error al enviar el archivo')
    }
  })
})
export default router
