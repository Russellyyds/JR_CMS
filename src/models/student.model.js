const { Schema, model } = require("mongoose")
const  Joi=require("joi");
const studentSchema = new Schema({
    firstName: {
        type: String,  //也可以写成type：“string”
        required: true,
        
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        //这种方法太依赖于runvalidator=true  在这个mongoose里面 只有.save（）方法会自动开启 runValidators
        validate: [
            { 
                validator: (email) => {
                    //regex 用验证邮箱
                    //可以用常见的validation library 比如说 Joi，yup,express-validator,validator.js
                    return Joi.string().email().validate(email).error===undefined;
                 }, 
                msg: "Invali email format" 
            }
        ]
    },
    courses: [
        {
            type: String,
            ref: "Course"
        }
    ]
});
const Student = model("Student", studentSchema);
//这个"Student"会被创建出students 在数据库中默认加s

module.exports = Student;