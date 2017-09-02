import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// use native Promise
mongoose.Promise = global.Promise
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: String,
  name: String,
  password: String,
  verify: String,
  status: {
    type: Boolean,
    default: false
  },
  joindate: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  // hash password
  const hash = bcrypt.hashSync(this.password, 10)
  this.password = hash
  next()
})
userSchema.methods.storePass = function (pass) {
  this.password = pass
  this.save()
}

export default mongoose.model('user', userSchema)