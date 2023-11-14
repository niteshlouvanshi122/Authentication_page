require("dotenv").config()
const express = require("express");
require("./db/conn")
const router = require("./routes/router")
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router);


app.listen(4000,()=>{
    console.log("server is stated on 4000");
})