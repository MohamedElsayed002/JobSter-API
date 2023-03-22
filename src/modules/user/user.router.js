

import express from 'express'
import auth from '../../middleware/authentication.js'
import {register,login , updateUser} from './user.controller.js'
const userRouter = express.Router()

userRouter.post('/register' , register)
userRouter.post('/login' , login)
userRouter.patch('/updateUser',  auth, updateUser)

export default userRouter