module.exports=(error,req,res,next)=>{

    //添加日志记录
    console.log("最后的一个异常类处理",error)
    console.log("message是：",error.message)
    res.status(500).json({
        error:"Unexpected error happend,please try again"
    })

}