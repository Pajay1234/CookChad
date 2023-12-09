const express = require('express')
const userRoutes = require('./routes/userRoutes'); 
const dotenv = require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000
const connectDB = require('./config/db')
const postRoutes = require('./routes/postRoutes')
const bodyParser = require('body-parser');

connectDB()
const app = express()

app.use(cors({
  origin: true,
  maxAge: 86400
}));


// Allow for up to 50 mb files, allow for json parsing, and open up routes for user and post controllers.
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})


