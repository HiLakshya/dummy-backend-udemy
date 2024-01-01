// Middleware for handling auth
const {Admin} = require('../db/index');
const jwt = require('jsonwebtoken');


async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    // usernmae = req.headers.username;
    // password = req.headers.password;

    const jwtText = req.headers.authorization;
    const token = jwtText.split(' ')[1]; // Bearer <token> => [<Bearer>, <token>]

    const SECRET = process.env.JWT_SECRET;

    // const ifAdmin = await Admin.findOne({
        
    //         username: usernmae,
    //         password: password
    // });
    try{

        const ifAdmin = jwt.verify(token, SECRET);
        if ( ifAdmin) {
            next();
        } 
    }
    catch(error){
        res.status(401).send('Unauthorized Admin');
    }

    
}

module.exports = adminMiddleware;