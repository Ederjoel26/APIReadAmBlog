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
                <center> 
                    <h1> Hola, bienvenido a la verificacion de ReadAm <h1/> 
                    <h2> Este es tu token de verificacion: <br/> <b> ${token} <b/> <h2/>
                <center/>`, 
        });
    
        res.json(token);
    }catch (error){
        res.json('error');
    }  
});

router.post('/insert', (req, res) => {
    try{
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

router.put('/update/:name', (req, res) => {
    try{
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