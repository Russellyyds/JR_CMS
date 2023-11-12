require('dotenv').config();
const express=require("express")
require("express-async-errors"); //加了之后，就算出错也不会导致整个服务死机
const helmet=require("helmet");
const dotenv = require('dotenv');
const morgan=require("morgan");

const cors=require("cors")
const v1Router = require("./routes")
const connectToDB = require("./utils/db_connection");
const unknownError = require('./middleware/error/unknownError');
const validationError = require('./middleware/error/validationError');
const validationErrorMiddleware = require('./middleware/error/validationError');
const notFoundError = require('./middleware/error/notFoundError');


const port=process.env.PORT || 4000
const app=express()
app.use(morgan(process.env.NODE_ENV==="production"?"combined":"dev"));
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use("/v1",v1Router)



// //加入全局异常处理中间件
app.use(validationError)
// //自定义的异常  且引入处理中间件
// app.use(notFoundError)
app.use(unknownError)

//正常的逻辑先连接DB 再连接系统

connectToDB().then(()=>{
    app.listen(port,()=>{
    console.log(`server 启动 ${port}`)
})
})
