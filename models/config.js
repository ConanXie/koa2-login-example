import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/login-test', {
  useMongoClient: true
})

mongoose.Promise = global.Promise

export default mongoose
