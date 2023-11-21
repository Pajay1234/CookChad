const express = require('express')
const userRoutes = require('./routes/userRoutes'); 
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const connectDB = require('./config/db')

connectDB()
const app = express()


app.use(express.json());
app.use('/api/user', userRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})