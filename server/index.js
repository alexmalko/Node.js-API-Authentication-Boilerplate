const express = require('express');
const app = express();
const connectDB = require('./config/db'); //connect to mongo which is in config/db.js file
const item = require('./routes/item');

// Connect Database
connectDB();

// Init Middleware - replacement for bodyparser allows us to read data from the form
app.use(express.json());

app.use('/api/item', item); //defining routes in the separate file middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
