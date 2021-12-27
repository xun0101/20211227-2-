import jwt from 'jsonwebtoken'
import users from '../models/users.js'

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ''
    if (token.length > 0) {
      const decoded = jwt.decode(token)
      req.user = await users.findOne({ _id: decoded._id, jwt: token }, '-password')
      req.token = token
      if (req.user === null) {
        throw new Error()
      } else {
        if (req.baseUrl === '/users' && req.path === '/extend') {
          next()
        } else {
          jwt.verify(token, process.env.SECRET)
          next()
        }
      }
    } else {
      throw new Error()
    }
  } catch (error) {
    console.log(error)
    res.status(401).send({ sucess: false, message: '未登入' })
  }
}
