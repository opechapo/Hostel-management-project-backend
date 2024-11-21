require("dotenv").config();
const mongoose = require("mongoose");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/errorMiddleWare");
const express= require('express');
const app = express();
const cors = require('cors');
const adminRoutes = require("./routes/adminRoutes");
const cookieParser = require('cookie-parser');



const PORT = 5000


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res,next) => {
  res.header("Access-Control-Allow-Origin");
  next();
})

app.use("/admin", adminRoutes);

app.use(cors({

  origin: ["http://localhost:5173"], 
  credentials: true,
  optionsSuccessStatus: 200,
  methods: "GET, POST, PUT,DELETE, PATCH,HEAD, OPTIONS",
}))

app.get('/',(req, res) => console.log("Hello world"))


connectDb();

app.use(errorHandler);

mongoose.connection.once("open", () =>{
  console.log("Database connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  
})
