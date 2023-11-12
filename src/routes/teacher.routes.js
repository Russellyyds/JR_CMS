const { Router } = require("express");
const teacherRouter = Router();

teacherRouter.get("/")
teacherRouter.post("/")
teacherRouter.get("/:id")
teacherRouter.patch("/:id")
teacherRouter.delete("/:id")
//to do 老师解绑  需要删除课程和学生
module.exports=teacherRouter;
