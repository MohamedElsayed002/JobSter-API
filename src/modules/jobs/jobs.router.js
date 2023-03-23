

import express from 'express'
import auth from '../../middleware/authentication.js'
import { getAllJobs , getJob , createJob , updateJob , deleteJob , showStats} from './jobs.controller.js'
import testUser from '../../middleware/testUser.js'


const JobsRouter = express.Router()

// Demo user read only can not to create or update or delete 

JobsRouter.get('/getAllJobs' , auth, testUser , getAllJobs)
JobsRouter.get('/getJob/:id' , auth,  getJob)
JobsRouter.post('/createJob' , auth , createJob)
JobsRouter.patch('/updateJob/:id' , auth , updateJob)
JobsRouter.delete('/deleteJob/:id' , auth , deleteJob)
JobsRouter.get('/showStats' , auth , showStats)


export default JobsRouter