import express from 'express'
import fs from 'fs'
import path from 'path'

const router = express.Router()

router.get('/:file', (req, res) => {
  const filepath = path.join(process.cwd(), `/upload/${req.params.file}`)
  if (!fs.existsSync(filepath)) {
    res.status(404).send({ success: false, message: '找不到檔案' })
  } else {
    res.sendFile(filepath)
  }
})

export default router
