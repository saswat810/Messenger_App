const {model,Schema} = require('mongoose');

const registerSchema = new Schema({
     userName : {
          type : String,
          required : true
     },
     email : {
          type: String,
          required : true
     },
     password : {
          type: String,
          required : true,
          select : false
     },
     image: {
          data: Buffer,
          contentType: String
     },
     createdAt: {
          type: Date,
          default: Date.now
     }
},{timestamps : true});

module.exports = model('user',registerSchema);