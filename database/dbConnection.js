

import  mongoose from 'mongoose'


export function dbConnection () {
    mongoose.connect(process.env.CONNECTION)
        .then(() => console.log('connection established'))
        .catch((err) => console.log(err))
}