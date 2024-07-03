const expess = require("express");

const app = expess;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");




app.listen(8800,()=>{
    console.log("backend sever is running")
})