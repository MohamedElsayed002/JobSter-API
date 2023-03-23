

import express from 'express'
import auth from '../../middleware/authentication.js'
import { getAllJobs } from './jobs.controller.js'
import testUser from '../../middleware/testUser.js'


const JobsRouter = express.Router()

// Demo user read only can not to create or update or delete 

JobsRouter.get('/getAllJobs' , auth, testUser , getAllJobs)


export default JobsRouter