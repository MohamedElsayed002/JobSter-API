

import mongoose from 'mongoose' 



const jobSchema = new mongoose.Schema({
    company : {
        type : String,
        required : [true , 'please provide company name'],
        maxLength : 50,
    },
    position : {
        type : String,
        required : [true , 'please provide position'],
        maxLength : 100,
    },
    status : {
        type : String,
        enum : ['interview' , 'declined' , 'pending'],
        default : 'pending'
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required: [true, 'Please provide user'],
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'remote', 'internship'],
        default: 'full-time',
    },
    jobLocation: {
        type: String,
        default: 'my city',
        required: true,
    },
},{timestamps : true})


export const JobsModel = mongoose.model('Job', jobSchema)