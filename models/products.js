import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少品名']
  },
  price: {
    type: Number,
    required: [true, '缺少價格']
  },
  image: {
    type: String,
    required: [true, '缺少圖片']
  }
}, { versionKey: false })

export default mongoose.model('products', productSchema)
