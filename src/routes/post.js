const express = require('express');
const postSchema = require('../models/post');

const router = express.Router();

router.post('/insert', (req, res) => {
    try{
        const post = postSchema(req.body);
        post
            .save()
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    }catch (error){
        res.json(error);
    }
});

router.get('/all', (req, res) => {
    try {
        postSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
    } catch (error) {
        res.json(error);
    }  
});

router.get('/find/:id', (req, res) => {
    try {
        const { id } = req.params;
        postSchema
            .find({ _id: id })
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    } catch (error) {
        res.json(error);
    } 
});

router.put('/update/:id', (req, res) => {
    try{
        const { id } = req.params;
        const { user, postName, reactions, coments, creationDate, imgBodyAddress, imgThumbnailAddress, categories, isNSFW} = req.body;
        postSchema
            .updateOne({ _id: id}, 
                {
                    $set: 
                    {
                        user: user,
                        postName: postName,
                        reactions: reactions,
                        coments: coments,
                        creationDate: creationDate,
                        imgBodyAddress: imgBodyAddress,
                        imgThumbnailAddress: imgThumbnailAddress,
                        categories: categories,
                        isNSFW: isNSFW
                    }
                }
            )
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    }catch (error){
        res.json(error);
    }
});

router.delete('/remove/:id', (req, res) => {
    try {
        const { id } = req.params;
        postSchema
            .remove({ _id: id})
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    } catch (error) {
        res.json(error);
    }  
});


module.exports = router;