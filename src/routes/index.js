const { Router } = require("express");
const studentRouter = require("./student.routes");
const courseRouter = require("./course.routes");
const authRouter = require("./auth.routes");
const roleGuard = require('../middleware/roleGuard.js');

const v1Router = Router()
v1Router.use("/students", studentRouter)
v1Router.use("/courses", roleGuard('admin'),courseRouter)
v1Router.use("/",authRouter)
module.exports = v1Router;