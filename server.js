const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fit'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/Photos', express.static(path.join(__dirname, 'public', 'Photos')));

app.use(cors());

app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.post('/form', (req, res) => {
    const { name, email, phone, age, gender, password, height, weight, bmi, goal } = req.body;

    if (!name || !email || !phone || !age || !gender || !height || !weight || !bmi || !goal || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO users (name, email, phone, age, gender, height, weight, bmi, goal, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, phone, age, gender, height, weight, bmi, goal, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'User added successfully' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if email already exists in login table
    const checkLoginQuery = 'SELECT * FROM login WHERE email = ?';
    db.query(checkLoginQuery, [email], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking login table:', checkErr.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (checkResult.length === 0) {
            // If not found, insert into login table
            const insertQuery = 'INSERT INTO login (email, password) VALUES (?, ?)';
            db.query(insertQuery, [email, password], (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting into login table:', insertErr.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                // Proceed to login validation after insert
                validateLogin();
            });
        } else {
            // If already exists, just proceed to login validation
            validateLogin();
        }

        function validateLogin() {
            const userCheckQuery = 'SELECT * FROM users WHERE email = ? AND password = ?';
            db.query(userCheckQuery, [email, password], (userErr, userResult) => {
                if (userErr) {
                    console.error('Error validating user:', userErr.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                if (userResult.length > 0) {
                    req.session.userEmail = email;
                    res.json({ success: true, message: 'Login successful' });
                } else {
                    res.status(401).json({ success: false, error: 'Invalid email or password' });
                }
            });
        }
    });
});



app.get('/get_logged_in_user', (req, res) => {
    if (!req.session.userEmail) {

        return res.status(401).json({ error: 'No user is logged in.' });
    }
    res.json({ email: req.session.userEmail });
});


app.get('/profile/:email', (req, res) => {
    const email = req.params.email;

    const query = 'SELECT name, email, phone, age, gender, height, weight, bmi, goal FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
        if (err) {
            console.error('Error fetching user data:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result[0]);
    });
});



app.post('/update-profile', (req, res) => {
    const { email, name, phone, age, height, weight, goal } = req.body;

    if (!email || !name || !phone || !age || !height || !weight || !goal) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'UPDATE users SET name = ?, phone = ?, age = ?, height = ?, weight = ?, goal = ? WHERE email = ?';
    db.query(query, [name, phone, age, height, weight, goal, email], (err, result) => {
        if (err) {
            console.error('Error updating user data:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ success: true, message: 'User updated successfully' });
    });
});

const exercises = {
    "weight_loss": [
        { name: "Jumping Jacks", image: "/Photos/womanjumpingjacks.jpg", video: "https://www.youtube.com/embed/c4DAnQ6DtF8" },
        { name: "Burpees", image: "/Photos/burpee.jpg", video: "https://www.youtube.com/embed/JZQA08SlJnM" },
        { name: "Mountain Climbers", image: "/Photos/mountainclimbers.jpg", video: "https://www.youtube.com/embed/nmwgirgXLYM" },
        { name: "Push-ups",image:"/Photos/pushups.jpg", video: "https://www.youtube.com/embed/IODxDxX7oi4" },
        { name: "Squats",image:"/Photos/squats.jpg",video: "https://www.youtube.com/embed/QKKZ9AGYTi4" },
        { name: "Lunges",image:"/Photos/lunges.jpg", video:"https://www.youtube.com/embed/Z2n58m2i4jg"},
        { name: "Side Plank",image:"/Photos/sideplank.jpg",video: "https://www.youtube.com/embed/mRyDsbctT6g" },
        { name: "Russian Twists",image:"/Photos/russiantwist.jpg", video: "https://www.youtube.com/embed/wkD8rjkodUI" },
        { name: "Leg Raises", image: "/Photos/legraises.jpg", video: "https://www.youtube.com/embed/Wp4BlxcFTkE" }

    ],
    "fitness": [
        { name: "Push-ups", image: "/Photos/pushups.jpg", video: "https://www.youtube.com/embed/IODxDxX7oi4" },
        { name: "Squats", image: "/Photos/squats.jpg", video: "https://www.youtube.com/embed/QKKZ9AGYTi4" },
        { name: "Lunges", image: "/Photos/lunges.jpg", video: "https://www.youtube.com/embed/Z2n58m2i4jg" },
        { name: "Side Plank", image: "/Photos/sideplank.jpg", video: "https://www.youtube.com/embed/mRyDsbctT6g" },
        { name: "Jumping Jacks", image: "/Photos/womanjumpingjacks.jpg", video: "https://www.youtube.com/embed/c4DAnQ6DtF8" },
        { name: "Plank", image: "/Photos/plank.png", video: "https://www.youtube.com/embed/Fcbw82ykBvY" },
        { name: "Standing Abs", image: "/Photos/standingabs.webp", video: "https://www.youtube.com/embed/7kFhMnf9JvA" },
        { name: "Seated Abs", image: "/Photos/seatedabs.webp", video: "https://www.youtube.com/embed/Fcbw82ykBvY" }

    ],
    "body_building": [
        { name: "Bench Press", image: "/Photos/benchpress.jpg", video: "https://www.youtube.com/embed/SCVCLChPQFY" },
        { name: "Deadlifts", image: "/Photos/deadlift.jpg", video: "https://www.youtube.com/embed/op9kVnSso6Q" },
        { name: "Dumbbell Shoulder Press", image: "/Photos/shoulderpress.jpg", video: "https://www.youtube.com/embed/qEwKCR5JCog" },
        { name: "Triceps Dips", image: "/Photos/tricepsdips.jpg", video: "https://www.youtube.com/embed/0326dy_-CzM" },
        { name: "Lat Pulldown", image: "/Photos/latpulldown.jpg", video: "https://www.youtube.com/embed/CAwf7n6Luuc" },
        { name: "Leg Press", image: "/Photos/legpress.jpg", video: "https://www.youtube.com/embed/IZxyjW7MPJQ" },
        { name: "Kettlebell Swing", image: "/Photos/kettlebell.jpg", video:"https://youtu.be/mKDIuUbH94Q?si=fEW5XUDB3TkhWO1j" }

    ],
    
};

app.get('/exercises/:goal', (req, res) => {
    const { goal } = req.params;
    if (exercises[goal]) {
        res.json(exercises[goal]);
    } else {
        res.status(404).json({ error: 'No exercises found for this goal' });
    }
});

app.get('/exercises', (req, res) => {
    let allExercises = [];
    Object.values(exercises).forEach(category => {
        allExercises = allExercises.concat(category);
    });
    res.json(allExercises);
});



app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }
        res.json({ success: true, message: "Logged out successfully" });
    });
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

