const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./src/routes/user');
const postRoutes = require('./src/routes/post');
const categoryRoutes = require('./src/routes/category');

const app = express();
const port = process.env.PORT || 9000;

//middleware
app.use(express.json());
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/category', categoryRoutes);


// routes
app.get('/', (req, res) => {
    res.send('<center> <h1> Welcome to the ReadAmAPI </h1> </center>')
});

// mongodb connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to mongoDB Atlas'))
    .catch((error) => console.error(error));

app.listen(port, () => {
    console.log("The server is ready");
});