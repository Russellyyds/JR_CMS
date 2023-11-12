const bcrypt=require("bcrypt")
const { Schema, model } = require("mongoose")

const UserSchema=new Schema({
    username:{
        type:String,
        required: true,
        unique:true, //mongoose会创建一个唯一的index 在mongodb里面 确保username唯一
    },
    password:{
        type:String,
        required: true,
        minlength:8,
        maxlength:200
    }
})

UserSchema.methods.hashPassword=async function(){
    this.password=await bcrypt.hash(this.password,12)
}
UserSchema.methods.validatePassword=async function(password){
    return await bcrypt.compare(password,this.password)
}


const User = model("User", UserSchema);
//这个"Student"会被创建出students 在数据库中默认加s

module.exports = User;