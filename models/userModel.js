const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username:{
        type: Schema.Types.Mixed,
        require: true,
        unique: true
    },
    email:{
        type : String,
        require: true,
        unique: true
    },
    password:{
        type : String,
        require: true
    },
    timestamp:{
        type : Date,
        default: Date.now
    }
  });

  const User = mongoose.model('user',UserSchema)    
  module.exports = User