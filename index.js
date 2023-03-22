
import express from 'express'
const app = express()
import * as dotenv from 'dotenv' 
dotenv.config()

import { dbConnection } from './database/dbConnection.js'
dbConnection()

import errorHandlerMiddleware from './src/middleware/error-handler.js'
import notfound from './src/middleware/notfound.js'
import userRouter from './src/modules/user/user.router.js'
import JobsRouter from './src/modules/jobs/jobs.router.js'


app.use(express.json())
app.use(userRouter)
app.use(JobsRouter)

app.get('/' , (req,res) => {
    res.send('hello')
})



// Errors handler middleware

app.use(errorHandlerMiddleware)
app.use(notfound)


const PORT = process.env.PORT || 3000
app.listen(PORT , () => {
    console.log(`listening on ${PORT}`)
})