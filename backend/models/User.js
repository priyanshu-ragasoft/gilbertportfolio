import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      default: 'Admin User',
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin', 'editor'],
      default: 'admin',
    },
    avatar: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method to verify entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate signed JWT Token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET || 'gilbert_super_secure_jwt_secret_key_2026_@#!$%',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  )
}

const User = mongoose.model('User', userSchema)
export default User
