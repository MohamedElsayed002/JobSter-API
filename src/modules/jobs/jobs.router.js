

import express from 'express'
import auth from '../../middleware/authentication.js'
import { getAllJobs } from './jobs.controller.js'



const JobsRouter = express.Router()



JobsRouter.get('/getAllJobs' , auth, getAllJobs)


export default JobsRouter