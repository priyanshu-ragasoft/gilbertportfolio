import multer from 'multer'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'

const UPLOAD_BUCKET = 'uploads'

// Vercel serverless can only write to /tmp, and that disk is wiped between
// invocations. Persist uploads in MongoDB there, and keep local files in dev.
const isServerless = Boolean(process.env.VERCEL)

export function getUploadDir() {
  return path.join(process.cwd(), 'uploads')
}

function ensureUploadDir() {
  const uploadDir = getUploadDir()
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    return uploadDir
  } catch (error) {
    console.warn('[Uploads]: could not create uploads directory:', error.message)
    return null
  }
}

if (!isServerless) {
  ensureUploadDir()
}

const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = ensureUploadDir()
    if (!uploadDir) {
      cb(new Error('Upload directory is not available on this server'))
      return
    }
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname || '')
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  },
})

class GridFSStorage {
  _handleFile(req, file, cb) {
    let settled = false
    const done = (err, info) => {
      if (settled) return
      settled = true
      cb(err, info)
    }

    connectDB()
      .then(() => {
        if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
          done(new Error('Database is not connected. Set MONGO_URI in the Vercel project settings.'))
          return
        }

        const ext = path.extname(file.originalname || '')
        const filename = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: UPLOAD_BUCKET,
        })
        const uploadStream = bucket.openUploadStream(filename, {
          contentType: file.mimetype,
        })

        file.stream.on('error', done)
        uploadStream.on('error', done)
        uploadStream.on('finish', () => {
          done(null, {
            filename: uploadStream.id.toString(),
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: uploadStream.length,
          })
        })
        file.stream.pipe(uploadStream)
      })
      .catch(done)
  }

  _removeFile(req, file, cb) {
    cb(null)
  }
}

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp|gif|svg/
  const extname = allowedFileTypes.test(path.extname(file.originalname || '').toLowerCase())
  const mimetype = allowedFileTypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  }
  cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, GIF, SVG) are allowed!'))
}

export const upload = multer({
  storage: isServerless ? new GridFSStorage() : diskStorage,
  // Vercel request bodies are capped at 4.5MB. Stay under that in production.
  limits: { fileSize: isServerless ? 4 * 1024 * 1024 : 10 * 1024 * 1024 },
  fileFilter,
})

export async function serveStoredUpload(req, res, next) {
  const fileId = decodeURIComponent((req.path || '').replace(/^\/+/, '').split('/')[0] || '')
  if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
    return next()
  }

  try {
    await connectDB()
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return next()
    }

    const id = new mongoose.Types.ObjectId(fileId)
    const files = await mongoose.connection.db
      .collection(`${UPLOAD_BUCKET}.files`)
      .find({ _id: id })
      .limit(1)
      .toArray()

    if (!files.length) return next()

    const file = files[0]
    res.setHeader('Content-Type', file.contentType || 'application/octet-stream')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    if (file.length) res.setHeader('Content-Length', String(file.length))

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: UPLOAD_BUCKET,
    })
    const download = bucket.openDownloadStream(id)
    download.on('error', (err) => {
      if (!res.headersSent) next(err)
      else res.destroy(err)
    })
    download.pipe(res)
  } catch (error) {
    next(error)
  }
}
