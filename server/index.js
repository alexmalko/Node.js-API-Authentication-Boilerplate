const express = require('express');
const app = express();
const connectDB = require('./config/db'); //connect to mongo which is in config/db.js file
const posts = require('./routes/Posts');
const auth = require('./routes/Login');
const users = require('./routes/Users');
const dotenv = require('dotenv'); //loading environmental variable

//loading environmental variable
dotenv.config();

// Connect Database
connectDB();

// Init Middleware - replacement for bodyparser allows us to read data from the form
app.use(express.json());

// Define Routes
app.use('/api/posts', posts);
app.use('/api/login', auth);
app.use('/api/users', users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
