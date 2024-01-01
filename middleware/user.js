const {User} = require('../db/index');

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
   
        let username = req.headers.username;
        let password = req.headers.password;
       

        let ifUserFound = await User.findOne({
            username: username,
            password: password
        });

        if (ifUserFound) {
            next();
        } else {
            res.status(401).send('Unauthorized User');
        }
        
    
}

module.exports = userMiddleware;