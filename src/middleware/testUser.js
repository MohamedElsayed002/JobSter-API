

import BadRequestError from '../error/bad-request.js'

const testUser = (req,res,next) => {
    if(req.user.testUser) {
        throw new BadRequestError('Test user . READ ONLY')
    }
    next()
}

export default testUser