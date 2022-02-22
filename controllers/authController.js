const User = require('../models/userModels')
const bcrypt = require('bcryptjs')

exports.signUp = async (req,res) => {
    const {username, password} = req.body
    console.log(req.body)
    try{
        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({username, password: hashPassword})
        res.status(201).json({"status": "success", "data": newUser})
    }catch(e){
        console.log(e)
        res.status(400).json({"status": "error", "data": e})
    }
}

exports.login = async (req,res) => {
    const {username, password} = req.body
    console.log(req.body, req.session)    
    const hashPassword = await bcrypt.hash(password, 12)
    try{
        const user = await User.findOne({username})

        if(!user){
            return res.status(404).json({status: 'fail', msg: "user not found"})
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if(isCorrect){
            req.session.user = user;
            res.status(200).json({
                status: 'correct'
            })
        }else{
            res.status(400).json({
                status:'fail', msg: 'login or password incorrect'
            })
        }
    }catch(e){
        console.log(e)
        res.status(400).json({"status": "error", "data": e})
    }
}