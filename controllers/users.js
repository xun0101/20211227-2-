import md5 from 'md5'
import jwt from 'jsonwebtoken'
import users from '../models/users.js'

export const createUser = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  try {
    const result = await users.create(req.body)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號或信箱重複' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }
  try {
    const user = await users.findOne({
      account: req.body.account,
      password: md5(req.body.password)
    }, '-password')

    if (user === null) {
      res.status(404).send({ success: false, message: '帳號或密碼錯誤' })
    } else {
      // jwt.sign(儲存的資料, secret, 其他設定)
      const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.SECRET,
        { expiresIn: '1 s' }
      )
      user.jwt.push(token)
      await user.save()
      res.status(200).send({ success: true, message: '', result: { token } })
    }
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getUserData = async (req, res) => {
  if (req.params.id !== req.user._id.toString()) {
    res.status(403).send({ success: false, message: '沒有權限' })
  } else {
    const result = req.user.toObject()
    delete result.jwt
    res.status(200).send({ success: true, message: '', result })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.jwt = req.user.jwt.filter(jwt => {
      return jwt !== req.token
    })
    await req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.jwt.findIndex(token => {
      return token === req.token
    })
    const token = jwt.sign(
      { _id: req.user._id.toString() },
      process.env.SECRET,
      { expiresIn: '1 s' }
    )
    req.user.jwt[idx] = token
    // 標記陣列內容有變動，不然不會更新
    req.user.markModified('jwt')
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: { token } })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
