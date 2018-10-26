import * as mongoose from "mongoose"

mongoose.connect(process.env.MONGODB as string, {
  useFindAndModify: false,
  useNewUrlParser: true,
  user: process.env.MONGODB_USER,
  // tslint:disable-next-line:object-literal-sort-keys
  pass: process.env.MONGODB_PASS,
})
