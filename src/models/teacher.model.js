const { Schema, model } = require("mongoose")
const Joi = require("joi");

const teacherSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        ref: "Course"
    },
    students: [{
        type:Schema.Types.ObjectId,
        ref:"Student"
    }],
    email: {
        type: String,
        required: true,
    }
})

const Teacher = model("Teacher", teacherSchema);

module.exports = teacherSchema;