const express = require('express');
const userSchema = require('../models/user');
const nodemailer = require('nodemailer');
const md5 = require('js-md5');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const multer = require('multer');
require('dotenv').config();
const router = express.Router();

const createRandomToken = () => {
    let token = '';
    for(let i = 0; i < 6; i++){
        token += Math.floor(Math.random() * (6 - 1) + 1);
    }
    return token;
}

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'src/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname );   
    }
});

const upload = multer({ storage: storage });

router.post('/addImageProfile', upload.single('imgProfile'), async (req, res) =>{
    const {imgPerfilAddress} = req.body;
    res.send(imgPerfilAddress);
});

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
            subject: "Código de recuperación", 
            html: `
               <body>
                    <div style='box-shadow: 0 4px 8px 0 rgb(0, 0, 0);
                                max-width: 300px;
                                background-color: #9fa3a9;
                                margin: auto;
                                border-radius: 10px;
                                border: 60px;
                                text-align: center;'>
                    <div style='  border: none;
                                    outline: 0;
                                    display: inline-block;
                                    padding: 8px;
                                    color: white;
                                    background-color: rgb(0, 0, 0);
                                    text-align: center;
                                    border-radius: 10px 10px 0px 0px;
                                    cursor: pointer;
                                    width: 95%;
                                    font-size: 18px;'>  
                        <p>ReadAm</p> </div>
                    <img src="https://th.bing.com/th/id/R.3291c1a14fb5181b93a66b20982e0e4e?rik=LBmnkdmjhjegow&riu=http%3a%2f%2fprofessionalhxh.weebly.com%2fuploads%2f4%2f5%2f7%2f8%2f45785219%2f7972827_orig.png&ehk=zaLl0TKkx0tKvvDgJyz72rmOmA2mSVZDkB7Vbxu%2bUWY%3d&risl=&pid=ImgRaw&r=0" style="width:80%; margin: 20px;">
                    <h1>¡Hola!</h1>
                    <p style='color: rgb(22, 22, 22);
                                    font-size: 18px;'>
                        Estas recibiendo este correo porque has solicitado una recuperación de contraseña para tu cuenta. <br/>
                        Este es tu código de verificación:</p>
                    <p> <h1> ${ tokenRecover } </h1> </p>
                    <div><br></div>
                    </div>
                </body>`, 
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
            <body>
                <div style='box-shadow: 0 4px 8px 0 rgb(0, 0, 0);
                            max-width: 300px;
                            background-color: #9fa3a9;
                            margin: auto;
                            border-radius: 10px;
                            border: 60px;
                            text-align: center;'>
                    <div style='border: none;
                                outline: 0;
                                display: inline-block;
                                padding: 8px;
                                color: white;
                                background-color: rgb(0, 0, 0);
                                text-align: center;
                                border-radius: 10px 10px 0px 0px;
                                cursor: pointer;
                                width: 95%;
                                font-size: 18px;'>  
                        <p> ReadAm </p> 
                    </div>
                    <img src="https://th.bing.com/th/id/R.3291c1a14fb5181b93a66b20982e0e4e?rik=LBmnkdmjhjegow&riu=http%3a%2f%2fprofessionalhxh.weebly.com%2fuploads%2f4%2f5%2f7%2f8%2f45785219%2f7972827_orig.png&ehk=zaLl0TKkx0tKvvDgJyz72rmOmA2mSVZDkB7Vbxu%2bUWY%3d&risl=&pid=ImgRaw&r=0" alt="ReadAmLogo" style="width:80%; margin: 20px;">
                    <h1 style='color: rgb(22, 22, 22);'> Bienvenido </h1>
                    <p style='color: rgb(22, 22, 22);
                            font-size: 18px;'> 
                        Tu codigo de verificacion es: 
                    </p>
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