const { Schema, model } = require("mongoose")

const courseSchema = new Schema({
    _id: {
        alias: 'code', // 在mongoose level取了一个别名 -> virtual property
        type: String,
        required: true, 
        uppercase: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: 'Course description',
    },
    // student:{
    //     type:Schema.Types.ObjectId,
    //     ref:"Student"
    // },  1对多的时候可以用这种
    students:[{
        type:Schema.Types.ObjectId,
        ref:"Student"
    }]

},
// {timestamps:true} 添加时间戳每个字段，这是有create 和update两个时间戳在数据库中
)


const Course = model("Course", courseSchema);

module.exports = Course;