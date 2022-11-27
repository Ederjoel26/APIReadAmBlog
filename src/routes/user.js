const express = require('express');
const userSchema = require('../models/user');
const nodemailer = require('nodemailer');
require('dotenv').config();
const router = express.Router();

const createRandomToken = () => {
    let token = '';
    for(let i = 0; i < 6; i++){
        token += Math.floor(Math.random() * (6 - 1) + 1);
    }
    return token;
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: 'gmail',
    port: 25,
    secure: false,
    auth:{ 
        type:'login',
        user: process.env.READAM_USER,
        pass: process.env.READAM_PASS 
    },
    tls: {
        rejectUnauthorized: false
    }
});

router.post('/sendMail', (req, res) => {
    const token = createRandomToken();

    transporter.sendMail({
        from: '"Bienvenido a ReadAm" <readam970@gmail.com>', 
        to: `${ req.body.email }`, 
        subject: "Hola nuevo usuario", 
        html: `
            <center> 
                <h1> Hola bienvenido a la verificacion de ReadAm <h1/> 
                <h2> Este es tu token de verificacion: <br/> <b> ${token} <b/> <h2/>
            <center/>`, 
    });

    res.json(token);
});

router.post('/insert', (req, res) => {
    const user = userSchema(req.body);
    user
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get('/all', (req, res) => {
    userSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get('/findEmail/:email', (req, res) => {
    const { email } = req.params;
    userSchema
        .findOne({ email: email })
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
});

router.get('/find/:name', (req, res) => {
    const { name } = req.params;
    userSchema
        .findOne({ userName: name })
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
});

router.put('/update/:name', (req, res) => {
    const { name } = req.params;
    const { userName, email, password, imgPerfilAddress, imgBackgroundAddress } = req.body;
    userSchema
        .updateOne({ userName: name }, 
            {
                $set: 
                {
                    userName: userName, 
                    email: email, 
                    password: password, 
                    imgPerfilAddress: imgPerfilAddress, 
                    imgBackgroundAddress: imgBackgroundAddress
                }
            })
        .then((data) => res.json(data))
        .catch((error) => res.json({message: error}));
});

router.delete('/remove/:name', (req, res) => {
    const { name } = req.params;
    userSchema
        .remove({ userName: name })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;