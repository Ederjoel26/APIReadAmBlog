const express = require('express');
const userSchema = require('../models/user');

const router = express.Router();

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