const { Router } = require("express");
const { User, Course } = require("../db/index");
const router = Router();
const userMiddleware = require("../middleware/user");
const zod = require("zod");

//Validation Schemas
const passwordSchema = zod.string().min(6);
const emailSchema = zod.string().email();

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.headers.username;
    const password = req.headers.password;

    if(emailSchema.safeParse(username).success && passwordSchema.safeParse(password).success){
        try {
            await User.create({
                username: username,
                password: password
            });
            res.status(201).json({ message: 'User created successfully' });
            
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

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    let courses = await Course.find({});
    res.json(courses);
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;

    await User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: courseId
        }
    })
    res.json({
        message: "Purchase complete!"
    })

});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username
    });
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });

    res.json({
        courses: courses
    })
});


module.exports = router