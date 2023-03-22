

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true,'please provide a name'],
        maxLength : 50,
        minLength : 3,
    },
    email : {
        type : String,
        required : [true ,'please provide a email address'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique : true
    },
    password : {
        type : String,
        required: [true , 'please provide password'],
        minLength : 5
    },
    lastName : {
        type :String,
        trim : true,
        maxLength : 20,
        default : 'lastName'
    },
    location : {
        type : String,
        trim : true,
        maxLength : 20,
        default : 'my city'
    }
})

userSchema.pre('save' , async function () {
    if(!this.isModified('password')) return 
    const salt = await bcrypt.genSalt(9)
    this.password = await bcrypt.hash(this.password,salt)
})


export const userModel = mongoose.model('User' , userSchema)