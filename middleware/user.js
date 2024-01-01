const {User} = require('../db/index');
const jwt = require('jsonwebtoken');

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
   
        let username = req.headers.username;
        
        const SECRET = process.env.JWT_SECRET;
        const jwtText = req.headers.authorization;
        const token = jwtText.split(' ')[1]; // Bearer <token> => [<Bearer>, <token>]

       

        // let ifUserFound = await User.findOne({
        //     username: username,
        //     password: password
        // });
        let ifUserFound = jwt.verify(token, SECRET);

        if (ifUserFound) {
            next();
        } else {
            res.status(401).send('Unauthorized User');
        }
        
    
}

module.exports = userMiddleware;