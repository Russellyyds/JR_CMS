const mongoose=require("mongoose")

const connectToDB=async()=>{
    const connectionString=process.env.CONNECTION_STRING;
    console.log("connectionString",connectionString)
    if(!connectionString){ //如果没传 就直接不让项目启动
        console.error("connectionString is not define");
        process.exit(1)
    }
    //这一部位了监听连接的过程中出现的问题
    const db=mongoose.connection
    db.on("error",(error)=>{
        console.log(error)
        process.exit(2)
    })
    db.on("connected",()=>{
        console.log("db连接成功")
    })
    db.on("disconnected",()=>{
        console.log("db,断开连接")
    })
    //其实最后一步就可以做到链接数据库
    return await mongoose.connect(connectionString,{useNewUrlParser: true,});
}

module.exports=connectToDB;
