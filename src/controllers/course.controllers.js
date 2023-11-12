const Course = require("../models/course.model")
const Student = require('../models/student.model');
const Joi = require("joi");
const getAllCourses = async (req, res) => {
    const courses = await Course.find().exec();
    res.status(200).json(courses);
}
const getCourseById = async (req, res) => {
    const { id } = req.params
    const course = await Course.findById(id)
        .populate("students", "firstName lastName email").select("name").exec()
    if (!course) {
        res.status(404).json({
            error: "Resource not found"
        })
        return;
    }
    res.json(course);

    //写法2:直接使用promise
    // await Course.findById(id)
    // .populate("students", "firstName lastName email")
    // .select("name")
    // .exec()
    // .then(data=>{
    //     if(!data){return res.status(404).json({
    //         msg:"resource not found"
    //     })}res.json(data)})
    // .catch(error=>next(error))}

}
const updateCourseById = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const { name, description } = req.body;
    console.log(name, description)
    const course = await Course.findByIdAndUpdate(
        id,
        {
            name,
            description,
        },
        {
            new: true,//返回更新之后的数据 否则会返回之前的数据
            // runValidators: true 强制跑数据库中定义的validation
        }
    ).exec();
    if (!course) {
        res.status(404).json({ error: 'course not found' });
        return;
    }
    res.json(course);
}
const deleteCourseById = async (req, res) => {
    const { id } = req.params
    const course = await Course.findByIdAndDelete(id).exec()
    if (!course) {
        res.status(404).json({
            error: "Resource not found"
        })
        return;
    }
    //上面删除了课程 在下面需要把学生里面的课程也要更新 否则会出现数据的不准确
    await Student.updateMany({ courses: id }, {
        $pull: {
            courses: id
        }
    }

    ).exec()

    res.sendStatus(204);

}
const addCourse = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
        code: Joi.string()
            .uppercase()
            .regex(/^[a-zA-Z]+[0-9]+$/)
            .message("Invalid code format,expecting something like COMP1011")
            .required()
    })
    const validBody = await schema.validateAsync(req.body, {
        allowUnknown: true,   //是否允许没有写在schema里面的字段  比如传了个id 默认是不允许，会报错
        stripUnknown: true,
    })
    const { code, name, description } = validBody;
    console.log(code, name, description)
    const checkCourse = await Course.findById(code).exec();
    if (checkCourse) {
        res.status(403).json({ msg: "existing" })
        return
    }
    const course = new Course({ code, name, description })  //mongos自动帮我我们生成ID
    await course.save();
    res.json(course);
}

module.exports = {
    getAllCourses,
    getCourseById,
    updateCourseById,
    deleteCourseById,
    addCourse
}
