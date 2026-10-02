import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true
    return
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gilbert', {
      serverSelectionTimeoutMS: 5000,
    })
    isConnected = true
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`)
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`)
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      process.exit(1)
    }
  }
}

