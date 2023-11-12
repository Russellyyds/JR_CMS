const User = require("../models/user.model")
const Joi = require("joi");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
    const { username, password } = req.body;
    // validation

    const user = new User({ username, password });
    await user.hashPassword()
    await user.save();
    const token=generateToken({_id:user._id,username,role:"admin"})
    //创建成功
    res.status(201).json({ token});
}

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    
    if (!(await user.validatePassword(password))) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }

    res.json({
        _id: user._id,
        username: user.username,
    });

}
module.exports = {
    register,
    login,
};