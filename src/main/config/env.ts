import dotenv from 'dotenv'
dotenv.config()

export const config = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongoadmin:secret@localhost:27888/?authSource=admin',
  port: process.env.PORT || 7777,
}
// https://www.code4it.dev/blog/run-mongodb-on-docker
