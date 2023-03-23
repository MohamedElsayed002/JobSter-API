

import { JobsModel } from "../../../database/models/Jobs.js";
import StatusCodes from 'http-status-codes'
import mongoose from "mongoose";
import moment from "moment";


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


export const getJob = async (req,res) => {
    const {id} = req.params 
    const user = req.user.userId

    const job = await JobsModel.findOne({
        _id : id,
        createdBy : user
    })

    if(!job) {
        res.status(404).json({message : `no job with id ${id}`})
    }

    res.status(200).json({job})
}


export const createJob = async (req,res) => {
    req.body.createdBy = req.user.userId
    const job = await JobsModel.create(req.body)
    res.status(200).json({job})
}


export const updateJob = async (req,res) => {
    const {id} = req.params
    const userId = req.user.userId

    if (req.body.company == ''  || req.body.position == '') {
        res.status(401).json({message : "all fields required"})
    }

    const job = await JobsModel.findByIdAndUpdate({
        _id : id,
        createdBy : userId
    }, req.body ,
    {new : true , runValidators : true})


    if(!job) { 
        res.status(404).json({message : 'job not found'})
    } 

    res.status(StatusCodes.OK).json({ job });
}


export const deleteJob = async (req,res) => {
    const {id} = req.params
    const userId = req.user.userId

    const job = await JobsModel.findByIdAndRemove({
        _id : id,
        createdBy : userId
    })

    if (!job) {
        res.status(404).json({message: 'Job not found'})
    }

    res.status(201).json({message : 'job successfully removed'});
}

// Important 
export const showStats = async (req,res) => {
    let stats = await JobsModel.aggregate([
        { $match: { createdBy: req.user.userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    stats = stats.reduce((acc,curr) => {
        const {_id : title , count } = curr
        acc[title] = count
        return acc
    }, {})

    const defaultStats = {
        pending :stats.pending || 0,
        interview : stats.interview || 0,
        declined : stats.declined || 0,
    }

    let monthlyApplications = await JobsModel.aggregate([
        {$match : {createdBy : req.user.userId}},
        {
            $group : {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count : {$sum : 1},
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
    ])

    monthlyApplications = monthlyApplications
    .map((item) => {
    const {
        _id: { year, month },
        count,
    } = item;
    const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
    return { date, count };
    })
    .reverse();


    res.status(201).json({ defaultStats, monthlyApplications });

}