import express from 'express'
import { createUser, login, getUserData, logout, extend } from '../controllers/users.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/', createUser)
router.post('/login', login)
router.post('/extend', auth, extend)
router.get('/:id', auth, getUserData)
router.delete('/logout', auth, logout)

export default router
