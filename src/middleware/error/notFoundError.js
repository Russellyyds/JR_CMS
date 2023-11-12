const NotFoundExcepetion=require("../../exceptions/NotFoundException")
module.exports=(error,req,res,next)=>{
    console.log("NotFoundExcepetion 运行了")
    if(error instanceof NotFoundExcepetion){
        res.status(404).json({error:error.message,notfound:true})
        return;
    }
    next(error)

}