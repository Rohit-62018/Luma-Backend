require('dotenv').config();
require('./DataBase/mongo');

const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { isAuth } = require('./utils/isAuth');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const Authentication = require('./routes/Authentication');
const crudChats = require('./routes/crud') 
const TTS = require('./controllers/tts');
const { ErrorHandler } = require('./utils/ExpressError');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended:true }));

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));




app.get('/', (req, res) => {
  res.send("Hello, Rohit! 🚀 Server chal raha hai...");
});

app.use('/',Authentication);
app.use('/user',crudChats);
app.post('/tts',isAuth, wrapAsync(TTS));

app.all(/.*/, (req, res,next) => {
  next(new ExpressError(404,"page not found"));
});

app.use(ErrorHandler);
    
app.listen(3000,()=>{
    console.log("Luma is working on 3000");
})