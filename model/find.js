import mongoose from 'mongoose'
// use native Promise
mongoose.Promise = global.Promise
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
  if (this.isModified('status')) next()

  const nextDay = new Date()
  nextDay.setDate(nextDay.getDate() + 1)
  this.deadline = nextDay
  next()
})

export default mongoose.model('find', findSchema)