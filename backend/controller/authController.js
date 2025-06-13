const formidable = require('formidable');
const validator = require('validator');
const registerModel = require('../models/authModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 

module.exports.userRegister = (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    const { userName, email, password, confirmPassword } = fields;
    const { image } = files;
    const error = [];

    if (!userName) error.push('Please provide your user name');
    if (!email) error.push('Please provide your Email');
    if (email && !validator.isEmail(email)) error.push('Please provide a valid Email');
    if (!password) error.push('Please provide your Password');
    if (!confirmPassword) error.push('Please provide your Confirm Password');
    if (password !== confirmPassword) error.push('Password and Confirm Password do not match');
    if (password && password.length < 6) error.push('Password must be at least 6 characters');
    if (!image) error.push('Please provide a user image');

    if (error.length > 0) {
      return res.status(400).json({
        error: {
          errorMessage: error
        }
      });
    }

    try {
      const existingUser = await registerModel.findOne({ email });
      if (existingUser) {
          console.log("existingUser email already registered",existingUser )
        return res.status(409).json({
          error: {
            errorMessage: ['Email is already registered']
          }
        });
      }

      const imageBuffer = fs.readFileSync(image.filepath); // Read the image file
console.log("imageBuffer", imageBuffer, "image", image)
      const newUser = await registerModel.create({
        userName,
        email,
        password: await bcrypt.hash(password, 10),
        image: {
          data: imageBuffer,
          contentType: image.mimetype
        }
      });


      const token = jwt.sign({
        id: newUser._id,
        email: newUser.email,
        userName: newUser.userName,
        registerTime: newUser.createdAt
      }, process.env.SECRET, {
        expiresIn: process.env.TOKEN_EXP
      });
console.log("newUser", newUser, "token", token)
      const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'None'
      };

      return res.status(201).cookie('authToken', token, options).json({
        successMessage: 'Your registration was successful',
        token
      });

    } catch (error) {
      return res.status(500).json({
        error: {
          errorMessage: ['Internal Server Error']
        }
      });
    }
  });
};

module.exports.userLogin = async (req,res) => {
      const error = [];
      const {email,password} = req.body;
      if(!email){
          error.push('Please provide your Email');
     }
     if(!password){
          error.push('Please provide your Passowrd');
     }
     if(email && !validator.isEmail(email)){
          error.push('Please provide your Valid Email');
     }
     if(error.length > 0){
          res.status(400).json({
               error:{
                    errorMessage : error
               }
          })
     }else {
          try{
               const checkUser = await registerModel.findOne({
                    email:email
               }).select('+password');

               if(checkUser){
                    const matchPassword = await bcrypt.compare(password, checkUser.password );

                    if(matchPassword) {
                         const token = jwt.sign({
                              id : checkUser._id,
                              email: checkUser.email,
                              userName: checkUser.userName,
                              image: checkUser.image,
                              registerTime : checkUser.createdAt
                         }, process.env.SECRET,{
                              expiresIn: process.env.TOKEN_EXP
                         }); 
      const options = { expires : new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000 )}
     res.status(200).cookie('authToken',token, options).json({
          successMessage : 'Your Login Successful',
          matchPassword: matchPassword,
          checkUser: checkUser,
          token
     })

                    } else{
                         res.status(400).json({
                              error: {
                                   errorMessage : ['Your Password not Valid']
                              }
                         })
                    }
               } else{
                    res.status(400).json({
                         error: {
                              errorMessage : ['Your Email Not Found']
                         }
                    })
               }
                

          } catch{
               res.status(404).json({
                    error: {
                         errorMessage : ['Internal Sever Error']
                    }
               })

          }
     }

}

module.exports.userLogout = (req,res) => {
     res.status(200).cookie('authToken', '').json({
          success : true
     })
}