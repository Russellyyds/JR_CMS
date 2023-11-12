const { Router } = require("express");
const { getAllStudents, getStudentById, deleteStudentById, updateStudentById, addStudent, addStudentToCourse, removeStudentFromCourse } = require("../controllers/student.controllers");
const studentRouter = Router();

studentRouter.get('/', getAllStudents);
studentRouter.get('/:id', getStudentById);
studentRouter.patch('/:id', updateStudentById);
studentRouter.post('/', addStudent);
studentRouter.delete('/:id', deleteStudentById);
studentRouter.post("/:studentId/courses/:courseId",addStudentToCourse)
studentRouter.delete("/:studentId/courses/:courseId",removeStudentFromCourse)

module.exports = studentRouter;