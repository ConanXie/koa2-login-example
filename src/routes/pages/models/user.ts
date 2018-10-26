import { model, Schema, Document } from "mongoose"
import { hashSync } from "bcryptjs"

export interface UserDocument extends Document {
  email: string
  name: string
  password: string
  status: boolean
  verify: string
  changePassword(password: string): void
}

const userSchema = new Schema({
  email: String,
  name: String,
  password: String,
  status: {
    default: false,
    type: Boolean,
  },
  verify: String,
})

/**
 * Use a hash password in database
 */
userSchema.pre("save", function(this: UserDocument, next) {
  if (!this.isModified("password")) {
    return next()
  }
  // hash password
  this.password = hashSync(this.password, 10)
  next()
})

userSchema.methods.changePassword = function(this: UserDocument, password: string) {
  this.password = password
  this.save()
}

export default model<UserDocument>("User", userSchema)
