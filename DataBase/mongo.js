const mongoose = require('mongoose');
const url = process.env.DB
mongoose.connect(url)
  .then(() => console.log('Database Connected!'))
  .catch((error)=>console.log("Mongoose connection fail",error));