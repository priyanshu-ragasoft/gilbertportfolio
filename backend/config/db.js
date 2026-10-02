import mongoose from 'mongoose'

// Fail immediately when the database is down instead of waiting 10s on buffered queries.
mongoose.set('bufferCommands', false)

let connectPromise = null

function resolveMongoUri() {
  const uri = process.env.MONGO_URI
  const onVercel = Boolean(process.env.VERCEL)

  if (onVercel && !uri) {
    throw new Error(
      'MONGO_URI is missing on Vercel. Add a MongoDB Atlas connection string in the project Environment Variables, then redeploy.'
    )
  }

  if (onVercel && /localhost|127\.0\.0\.1/.test(uri)) {
    throw new Error(
      'MONGO_URI on Vercel points at localhost. The database on your computer is not reachable from Vercel. Use a MongoDB Atlas connection string and redeploy.'
    )
  }

  return uri || 'mongodb://localhost:27017/gilbert'
}

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!connectPromise) {
    const uri = resolveMongoUri()
    connectPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 8000,
        family: 4,
      })
      .then((conn) => {
        console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`)
        return conn
      })
      .catch((error) => {
        connectPromise = null
        console.error(`[MongoDB Connection Error]: ${error.message}`)
        if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
          process.exit(1)
        }
        throw error
      })
  }

  return connectPromise
}
