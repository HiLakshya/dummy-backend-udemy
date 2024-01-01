const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db/index");
const router = Router();
const zod = require("zod");

//Validation Schemas
const passwordSchema = zod.string().min(6);
const emailSchema = zod.string().email();

// Admin Routes
router.post('/signup', async function (req, res) {
    // Implement admin signup logic
    const username = req.headers.username;
    const password = req.headers.password;


    if(emailSchema.safeParse(username).success && passwordSchema.safeParse(password).success){
        try {
            await Admin.create({
                username: username,
                password: password
            });
            res.status(201).json({ message: 'Admin created successfully' });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }
    else{
        console.log("Invalid");
        res.status(400).send("Invalid username or password");
    }   
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    try {
        let newCourse = await Course.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            imageLink: req.body.imageLink
        });
        res.status(201).json({ message: `Course created successfully courseId: ${newCourse._id} new course id` });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    try {
        let courses =  await Course.find({});
        res.status(200).json({ courses: courses });
        
    } catch (error) {
        console.log(error);
        res.status(400).send(error);    
    }
});

module.exports = router;