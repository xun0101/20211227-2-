import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { createProduct } from '../controllers/products.js'

const router = express.Router()

router.post('/', auth, upload, createProduct)

export default router
