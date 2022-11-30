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
            <style>
                .title {
                    color: rgb(22, 22, 22);
                    font-size: 18px;
                }
                
                .flo{
                    border: none;
                    outline: 0;
                    display: inline-block;
                    padding: 8px;
                    color: white;
                    background-color: rgb(0, 0, 0);
                    text-align: center;
                    border-radius: 10px 10px 0px 0px;
                    cursor: pointer;
                    width: 95%;
                    
                    font-size: 18px;
                }
                
                a {
                    text-decoration: none;
                    font-size: 22px;
                    color: black;
                }
                
                img {
                    margin: 20px;
                }
            </style>
            <body>
                <div style='box-shadow: 0 4px 8px 0 rgb(0, 0, 0);
                            max-width: 300px;
                            background-color: #9fa3a9;
                            margin: auto;
                            border-radius: 10px;
                            border: 60px;
                            text-align: center;'>
                    <div class="flo">  
                        <p> ReadAm </p> 
                    </div>
                    <img src="Logo (1).png" alt="John" style="width:80%">
                    <h1> Bienvenido </h1>
                    <p class="title"> Tu codigo de verificaion es: </p>
                    <p> 
                        <h1>${ token }</h1> 
                    </p>
                    <div> <br/> </div>
                </div>
            </body>`, 
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