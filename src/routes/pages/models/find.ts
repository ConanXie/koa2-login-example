import { model, Schema, Document } from "mongoose"

export interface FindDocument extends Document {
  deadline: Date
  status: boolean
  user: string
  verify: string
}

const findSchema = new Schema({
  deadline: Date,
  status: {
    default: false,
    type: Boolean,
  },
  user: Schema.Types.ObjectId,
  verify: String,
}, {
  timestamps: true,
})

findSchema.pre("save", function(this: FindDocument, next) {
  if (this.isModified("status")) {
    return next()
  }

  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 1)
  this.deadline = deadline
  next()
})

export default model<FindDocument>("Find", findSchema)
