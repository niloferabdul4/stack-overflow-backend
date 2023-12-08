import jwt from 'jsonwebtoken'

//if we recieve any req from client,then it will check whether there ia token and if it is valid or not
//then only the next operation swill be done(here next is a callback fn ie controllers actions)

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]    //[Bearer token] //selecting token
        const decodeData = jwt.verify(token, process.env.JWT_SECRET)       // verify the token with a secret
        req.userId = decodeData?.id                              // setting 
        next()
    }
    catch (error) {
        console.log(error)
    }
}

export default auth;
