import products from '../models/products.js'

export const createProduct = async (req, res) => {
  try {
    const result = await products.create({
      ...req.body,
      image: req.file.path
    })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
