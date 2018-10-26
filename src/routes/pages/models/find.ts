import mongoose from './config'

const Schema = mongoose.Schema

const findSchema = new Schema({
  user: Schema.Types.ObjectId,
  verify: String,
  status: {
    type: Boolean,
    default: false
  },
  deadline: Date
})

findSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    return next()
  }

  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 1)
  this.deadline = deadline
  next()
})

export default mongoose.model('Find', findSchema)
