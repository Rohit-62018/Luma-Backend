const mongoose = require('mongoose');
const url = "mongodb+srv://rohitkumargiddi:ryfwor-goznUz-0xutje@cluster0.fjlwgtf.mongodb.net/?appName=Cluster0"
mongoose.connect(url)
  .then(() => console.log('Database Connected!'))
  .catch((error)=>console.log("Mongoose connection fail",error));