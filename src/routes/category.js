const express = require('express');
const categoryScheme = require('../models/category');

const router = express.Router();

router.post('/insert', (req, res) => {
    try {
        const category = categoryScheme(req.body);
        category
            .save()
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    } catch (error) {
        res.json(error);
    }
});

router.get('/all', (req, res) => {
    try {
        categoryScheme
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
    } catch (error) {
        res.json('error');
    }
});

router.get('/find/:categoryName', (req, res) => {
    try {
        const { categoryName } = req.params;
        categoryScheme
            .find({ categoryName: categoryName})
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    } catch (error) {
        res.json(error);
    }
});

router.put('/update/:Name', (req, res) => {
    try {
        const { Name } = req.params;
        const { categoryName } = req.body;
        categoryScheme
            .updateOne({ categoryName: Name}, 
                { 
                    $set:
                    {
                        categoryName: categoryName
                    }
                }
            )
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    } catch (error) {
        res.json('error');
    } 
});

router.delete('/remove/:categoryName', (req, res) => {
    try {
        const { categoryName } = req.params;
        categoryScheme
            .remove({ categoryName: categoryName })
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    } catch (error) {
        res.json('error');
    } 
})

module.exports = router;