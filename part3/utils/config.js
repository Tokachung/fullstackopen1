require('dotenv').config()

const PORT = process.env.PORT || 3000
const HOST = '0.0.0.0'
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
    PORT,
    HOST,
    MONGODB_URI
}