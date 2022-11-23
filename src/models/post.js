const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user:{
        type: String,
        require: true
    },
    reactions:{
        type: Number
    },
    coments:{
        type: Array
    },
    creationDate: {
        type: String
    },
    imgBodyAddress:{
        type: String
    },
    imgThumbnailAddress:{
        type:String
    },
    categories:{
        type: Array
    },
    isNSFW:{
        type: Boolean,
        require:true
    }
});


module.exports = mongoose.model('Post', postSchema);