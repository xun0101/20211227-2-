import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
// import fs from 'fs'
// import path from 'path'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({
  storage: new CloudinaryStorage({ cloudinary }),
  /* 本機上傳
  storage: multer.diskStorage({
    // 上傳後檔案存放位置
    destination (req, file, callbak) {
      // 用 path 將目前執行的資料夾路徑與指定資料夾名稱組成絕對路徑
      const folder = path.join(process.cwd(), '/upload')
      // 如果資料夾不存在，建立資料夾
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
      }
      // callback(錯誤, 上傳存放相對路徑)
      callbak(null, 'upload/')
    },
    filename (req, file, callback) {
      // 使用日期 + 原始檔名的附檔名當儲存的檔名
      callback(null, Date.now() + path.extname(file.originalname))
    }
  }),
  */
  // 過濾檔案類型，因為內建的 limits 沒有所以要自己寫
  fileFilter (req, file, callback) {
    // 檢查檔案是不是圖片
    if (!file.mimetype.includes('image')) {
      // 觸發自訂的 LIMIT_FILE_FORMAT 錯誤
      callback(new multer.MulterError('LIMIT_FILE_FORMAT'), false)
    } else {
      callback(null, true)
    }
  },
  limits: {
    // 限制檔案 1MB
    fileSize: 1024 * 1024
  }
})

export default async (req, res, next) => {
  upload.single('image')(req, res, async (error) => {
    // 檢查是不是上傳錯誤
    if (error instanceof multer.MulterError) {
      let message = '上傳錯誤'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FILE_FORMAT') {
        message = '格式不符'
      }
      res.status(400).send({ success: false, message })
    } else if (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      next()
    }
  })
}
