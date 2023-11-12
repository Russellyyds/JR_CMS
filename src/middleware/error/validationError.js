module.exports=(error,req,res,next)=>{
    if(error.name==="ValidationError"){
        console.log("ValidationError",error)

        console.log(error)
        res.status(400).json({error:error.message})
        return;
    }
    next(error);
}