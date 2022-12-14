const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   email:{
      type: String,
      require: true
   },
   password:{
      type: String,
      require: true
   },
   userName: {
      type: String,
      require: true
   },
   name:{
      type: String,
      require: true
   },
   surname: {
      type: String,
      require: true
   },
   followers:{
      type: Array
   },
   categories:{
      type: Array
   },
   imgPerfilAddress:{
      type: String,
   },
   imgBackgroundAddress:{
      type: String
   }
});

module.exports = mongoose.model('User', userSchema);