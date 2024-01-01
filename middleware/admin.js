// Middleware for handling auth
const {Admin} = require('../db/index');


async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    usernmae = req.headers.username;
    password = req.headers.password;

    const ifAdmin = await Admin.findOne({
        
            username: usernmae,
            password: password
    });

    if ( ifAdmin) {
        next();
    } else {
        res.status(401).send('Unauthorized Admin');
    }
}

module.exports = adminMiddleware;