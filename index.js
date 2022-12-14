const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./src/routes/user');
const postRoutes = require('./src/routes/post');
const categoryRoutes = require('./src/routes/category');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));
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
    console.log(`The server is ready ${__dirname}`);
});