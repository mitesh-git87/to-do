const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function setAuthCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
}

function clearAuthCookie(res) {
    res.clearCookie("token", { 
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
}

async function registerUser(req, res) {

    const{ username, email , password} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {username},
            {email},
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({message:"user already exist"})
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash,
    });

    const token = jwt.sign(
        {
            id: user._id,
        },
        JWT_SECRET
    );

    setAuthCookie(res, token);

    res.status(200).json({
        message: 'user register successfully',
        user: {
            user : user._id,
            username : user.username,
            email: user.email,
        }
    });



}

async function loginUser(req, res) {
    const{username, email, password} = req.body

    const user = await userModel.findOne({
        $or :[
            {username},
            {email}
        ]
    });

    if(!user){
        return res.status(401).json({ message: "user not exist"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({message:"password is not valid"});
    }

    const token = jwt.sign(
        {
            id: user._id,
        },
        JWT_SECRET
    );

    setAuthCookie(res, token);

    res.status(200).json({message: "user login successfully",
        user :{
            user : user._id,
            username : user.username,
            email: user.email,
        }
    })
    
}

async function logoutUser(req, res) {
    clearAuthCookie(res);
    return res.status(200).json({ message: "logged out" });
}

async function me(req, res) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "unauthorized user" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("_id username email");
        if (!user) return res.status(401).json({ message: "unauthorized user" });
        return res.status(200).json({ message: "ok", user });
    } catch {
        return res.status(401).json({ message: "unauthorized user" });
    }
}

module.exports ={registerUser, loginUser, logoutUser, me};
