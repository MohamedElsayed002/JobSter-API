
import { userModel } from "../../../database/models/User.js";
import BadRequestError from '../../error/bad-request.js'
import UnauthenticatedError from '../../error/unauthenticated.js'
import {StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'



export const register = async (req,res) => {
    const user = await userModel.create({...req.body})
    const token = jwt.sign({userId : user._id , name : req.body.name} , 'Mohamed' , {expiresIn: '30d'})
    res.status(StatusCodes.CREATED).json({
        user : {
            email : user.email,
            lastName : user.lastName,
            location : user.location,
            name : user.name,
            token
        }
    })
}


export const login = async (req,res) => {
    const {email , password} = req.body 
    if(!email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({message : 'Invalid email or password'})
        // throw new   BadRequestError('please provide email and password')
    }
    const user = await userModel.findOne({email})
    if(!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({message : "Invalid credentials"})
    }
    let matchPassword = await  bcrypt.compare(password, user.password )
    if(!matchPassword) {
        res.status(StatusCodes.UNAUTHORIZED).json({message : 'Invalid credentials'} )
    }


    const token = jwt.sign({userId : user._id , name : req.body.name} , 'Mohamed' , {expiresIn: '30d'})
    res.status(StatusCodes.OK).json({
        user : {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token,
        },
        message : 'you logged in successfully'
    })
}


export const updateUser = async (req,res) => {
    const { email, name, lastName, location } = req.body;

    if(!email || !name || !lastName || !location) {
        res.status(StatusCodes.BAD_REQUEST).json({message : 'please provide all required fields'})
    }

    const user = await userModel.findOne({_id : req.user.userId})

    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.location = location;

    user.save()
    const token = jwt.sign({userId : user._id , name : req.body.name} , 'Mohamed' , {expiresIn: '30d'})
    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token,
        },
    });
    };
