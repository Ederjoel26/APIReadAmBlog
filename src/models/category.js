const mongoose = require('mongoose');

const categoryScheme = mongoose.Schema({
    categoryName:{
        type: String,
        require: true
    }
});


module.exports = mongoose.model('Category', categoryScheme);