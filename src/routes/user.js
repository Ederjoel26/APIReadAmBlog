const express = require('express');
const userSchema = require('../models/user');
const nodemailer = require('nodemailer');
const md5 = require('js-md5');
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
    service: 'gmail',
    auth:{ 
        user: process.env.READAM_USER,
        pass: process.env.READAM_PASS 
    }
});

router.post('/sendMailRecover', async (req, res) => {
    try{
        const tokenRecover = createRandomToken();
        
        await transporter.sendMail({
            from: '"Recuperacion de contraseña" <readam970@gmail.com>', 
            to: `${ req.body.email }`, 
            subject: "Token de recuperacion", 
            html: `
                <center> 
                    <h1> Hola, bienvenido a la recuperacion de contraseña de ReadAm <h1/> 
                    <h2> Este es tu token de recuperacion: <br/> <b> ${tokenRecover} <b/> <h2/>
                <center/>`, 
        });
        res.json(tokenRecover);
    }catch (e){

    }
});

router.post('/sendMail', async(req, res) => {
    try{
        const token = createRandomToken();

        await transporter.sendMail({
            from: '"Bienvenido a ReadAm" <readam970@gmail.com>', 
            to: `${ req.body.email }`, 
            subject: "Hola nuevo usuario", 
            html: `
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
                <div class="container">
                    <div class="card position-absolute top-50 start-50 translate-middle shadow-lg text-center">
                        <div class="card-body">
                        <h1 class="h1 txt-header card-title fw-bold">¡Hola!</h1>
                        <p class="h3 font-roboto p-2 card-text">Estas recibiendo este correo porque has solicitado una recuperación de contraseña para tu cuenta.</p>
                                <p class="h5">Este es su código de verificación:
                                <br><label class="h3 text-primary"> ${ token }</label></p>
                        </div>
                    </div>
                </div>`, 
        });
    
        res.json(token);
    }catch (error){
        res.json('error');
    }  
});

router.post('/insert', (req, res) => {
    try{
        req.body.password = md5(req.body.password);
        const user = userSchema(req.body);
        user
            .save()
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
        res.json('Cambios realizados');    
    }catch (error){
        res.json('error');
    }
});

router.get('/all', (req, res) => {
    try{
        userSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
    } catch (e) {
        res.json('error');
    }  
});

router.get('/findEmail/:email', (req, res) => {
    try{
        const { email } = req.params;
        userSchema
            .findOne({ email: email })
            .then((data) => res.json(data))
            .catch((error) => res.json({message: error}));        
    }catch (error) {
        res.json('error');
    }
});

router.get('/find/:name', (req, res) => {
    try{
        const { name } = req.params;
        userSchema
            .findOne({ userName: name })
            .then((data) => res.json(data))
            .catch((error) => res.json({message: error}));
    }catch (error) {
        res.json('error');
    }
});

router.put('/update/:emailParam', (req, res) => {
    try{
        const { emailParam } = req.params;
        const { userName, email, password, imgPerfilAddress, imgBackgroundAddress } = req.body;
        const passEncrypt = md5(password);
        userSchema
            .updateOne({ email: emailParam }, 
                {
                    $set: 
                    {
                        userName: userName, 
                        email: email, 
                        password: passEncrypt, 
                        imgPerfilAddress: imgPerfilAddress, 
                        imgBackgroundAddress: imgBackgroundAddress
                    }
                })
            .then((data) => res.json(data))
            .catch((error) => res.json({message: error}));
    }catch(error){
        res.json(error);
    }
});

router.delete('/remove/:name', (req, res) => {
    try{
        const { name } = req.params;
        userSchema
            .remove({ userName: name })
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    }catch (error){
        res.json(error);
    }
});

module.exports = router;