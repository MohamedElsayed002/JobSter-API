

import { JobsModel } from "../../../database/models/Jobs.js";
import StatusCodes from 'http-status-codes'
import mongoose from "mongoose";



export const getAllJobs = async (req,res) => {
    
    
    const {search , status , jobType , sort} = req.query
    const queryObject  = {
        createdBy : req.user.userId,
    }

    if(search) {
        queryObject.position = {$regex : search , $options : 'i'}
    }

    if(status && status !== 'all') {
        queryObject.status = status
    }

    if(jobType && jobType !== 'all') {
        queryObject.jobType = jobType
    }

    let result = JobsModel.find(queryObject);

    if (sort === 'latest') {
        result = result.sort('-createdAt');
    }
    if (sort === 'oldest') {
        result = result.sort('createdAt');
    }
    if (sort === 'a-z') {
        result = result.sort('position');
    }
    if (sort === 'z-a') {
        result = result.sort('-position');
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    result = result.skip(skip).limit(limit);

    const jobs = await result;

    const totalJobs = await JobsModel.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
}
