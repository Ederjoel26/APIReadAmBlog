const express = require('express');
const categoryScheme = require('../models/category');

const router = express.Router();

router.post('/insert', (req, res) => {
    const category = categoryScheme(req.body);
    category
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get('/all', (req, res) => {
    categoryScheme
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get('/find/:categoryName', (req, res) => {
    const { categoryName } = req.params;
    categoryScheme
        .find({ categoryName: categoryName})
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.put('/update/:Name', (req, res) => {
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
});

router.delete('/remove/:categoryName', (req, res) => {
    const { categoryName } = req.params;
    categoryScheme
        .remove({ categoryName: categoryName })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})

module.exports = router;