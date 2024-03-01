const { Router } = require("express");
const { User, Course } = require("../db/index");
const router = Router();
const userMiddleware = require("../middleware/user");
const zod = require("zod");
const jwt = require("jsonwebtoken");

//Validation Schemas
const passwordSchema = zod.string().min(6);
const emailSchema = zod.string().min(6);

router.get('/status', (req, res) => {
    res.json({
        status: "User API is working"
    });
});

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

router.post('/signin', async function (req, res) {
    let username = req.headers.username;
    let password = req.headers.password;
    const SECRET = process.env.JWT_SECRET;
    
    // Implement admin signin logic
    const ifUserExists = await User.findOne({

        username: username,
        password: password
    });

    if (ifUserExists) {
        const token = jwt.sign({ username: username }, SECRET);
        res.status(200).json({ token: token });
    } else {
        res.status(401).send('Unauthorized User');
    }


});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    let courses = await Course.find({});
    res.json(courses);
});

router.post('/courses', userMiddleware, async (req, res) => {
    try {
        // Implement course purchase logic
        const courseId = req.headers.courseid;
        const username = req.headers.username;

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required in the request body' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's purchasedCourses
        await User.updateOne(
            { username },
            { "$push": { purchasedCourses: courseId } }
        );

        res.json({
            message: 'Purchase complete!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
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