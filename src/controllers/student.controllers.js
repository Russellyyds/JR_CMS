const Student = require("../models/student.model")
const Course = require("../models/course.model");
const NotFoundExcepetion = require("../exceptions/NotFoundException");

const Joi = require("joi");
/**
 * 如果用async await的话 我们就选第一种
 * Handle errors -> handle async errors
 * 1. try catch -> async await
 * try {
 *    xxxxx
 * } catch(e) {
 *    // or handle it directly
 *    next(e);
 * }
 *
 * 因为直接查会直接返回promise对象 那就直接可以链式调用
 * 2. .catch -> promise
 * Student.find().exec().then().catch(e => next(e));
 *
 * 3. callback 也可以用回调函数的方式在exec里面处理 结果和错误
 * Student.find().exec((err, students)=>{
 *    if (err) {
 *       handle error
 *       next(err);
 *       return
 *    }
 * })
 */

// const catchAllErrors = (routeHandler) => {
//   return async (req, res,next) => {
//     try {
//       await routeHandler(req, res, next);
//     } catch(e) {
//       next(e);
//     }
//   }
// }
// express-async-errors 自动对所有的middleware做一个try catch
//其实他就负责调用next（）

const addStudent = async (req, res, next) => {
  // try {
    const { firstName, lastName, email } = req.body;
    //需要做data validation 不能直接使用前端传来的数据
    const student = new Student({ firstName, lastName, email })  //mongos自动帮我我们生成ID
    await student.save();
    // res.json(student);
    res.status(201).json(student);

  // } catch (e) {
  //   console.log(e)
  //     // next(e)
  //     // res.sendStatus(400);
  // }

}
const getAllStudents = async (req, res) => {
  //query chain
  // (await Student.find().sort().limit()).filter()
  const students = await Student.find().exec(); //find是异步函数  所以要加上await 且建议每一个query结束之后加一个exec
  res.json(students);

}
const getStudentById = async (req, res) => {
  console.log("getStudentById")
  const { id } = req.params
  const student = await Student.findById(id).exec()
  if (!student) {
    //自定义抛出的异常
    throw new NotFoundExcepetion("资源不存在");
    // res.status(404).json({
    //   error: "Resource not found"
    // })
    // return;
  }
  res.json(student);
}
const updateStudentById = async (req, res) => {
  console.log("updateStudentById")
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  console.log(firstName, lastName, email)
  const student = await Student.findByIdAndUpdate(
    id,
    {
      name: firstName,
      lastName,
      email,
    },
    { new: true }  //返回更新之后的数据 否则会返回之前的数据
  ).exec();
  // await Student.findOneAndUpdate({email}, {})
  if (!student) {
    throw new NotFoundExcepetion("资源不存在");

  }
  res.json(student);
}
const deleteStudentById = async (req, res) => {
  const schemaId=Joi.object({
    id:Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("objId不合法").required()
  })
  const validId=  await schemaId.validateAsync(req.params)
  const { id } = validId;
  const student = await Student.findByIdAndDelete(id).exec();
  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }
  await Course.updateMany({ students: student._id },
    {
      $pull: {
        students: student._id
      }
    }).exec();
  res.sendStatus(204);
}
// POST /v1/students/:studentId/courses/:courseId
const addStudentToCourse = async (req, res) => {
  const { studentId, courseId } = req.params;
  // 通过id找student和course
  const student = await Student.findById(studentId).exec();
  const course = await Course.findById(courseId).exec();
  if (!student || !course) {
    res.status(404).json({ error: 'Resource not found' });
    return;
  }
  // 把学生添加进课程
  course.students.addToSet(studentId);
  // 把课程添加给学生
  student.courses.addToSet(courseId);

  // 记得保存
  await student.save();
  await course.save();

  res.json(student);
}
// DELETE /v1/students/:studentId/courses/:courseId
const removeStudentFromCourse = async (req, res) => {
  const { studentId, courseId } = req.params;

  // 通过id找student和course
  const student = await Student.findById(studentId).exec();
  const course = await Course.findById(courseId).exec();
  console.log(student, course)
  // 确保学生和课程确实存在
  if (!student || !course) {
    res.status(404).json({ error: 'Student or course not found' });
    return;
  }
  student.courses.pull(courseId); // 取出来 pull -> $pull
  course.students.pull(studentId);

  await student.save();
  await course.save();

  res.sendStatus(204);
};
module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,
  addStudentToCourse, removeStudentFromCourse
}