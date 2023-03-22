

import jwt from 'jsonwebtoken'


const auth = async (req,res,next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Mohamed ')) {
        // throw new UnauthenticatedError('Authentication invalid');
        res.send(401).json({message : 'Authentication invalid'})
      }

    const token = authHeader.split(' ')[1]
    try {
        const user = jwt.verify(token , 'Mohamed')
        req.user = { userId: user.userId, name: user.name }
        next()
    }catch(err) {
        res.json({message : err.message})
    }

}

export default auth