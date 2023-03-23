

import express from 'express'
import auth from '../../middleware/authentication.js'
import {register,login , updateUser} from './user.controller.js'
import testUser from '../../middleware/testUser.js'
const userRouter = express.Router()


import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    message : 'to many request from this IP , please try again after 15 minutes ',
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

userRouter.post('/register' ,limiter , register)
userRouter.post('/login' ,  limiter,login)
userRouter.patch('/updateUser',  auth, testUser, updateUser)

export default userRouter