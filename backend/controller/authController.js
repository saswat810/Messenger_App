const formidable = require('formidable');
const validator = require('validator');
const registerModel = require('../models/authModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 

module.exports.userRegister = (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        error: { errorMessage: ['Form parsing failed'] }
      });
    }

    const { userName, email, password, confirmPassword } = fields;
    const imageFile = files.image;

    const errors = [];

    if (!userName) errors.push('Please provide your user name');
    if (!email) errors.push('Please provide your Email');
    if (email && !validator.isEmail(email)) errors.push('Please provide a valid Email');
    if (!password) errors.push('Please provide your Password');
    if (!confirmPassword) errors.push('Please provide your Confirm Password');
    if (password && confirmPassword && password !== confirmPassword) errors.push('Passwords do not match');
    if (password && password.length < 6) errors.push('Password must be at least 6 characters');
    if (!imageFile) errors.push('Please upload a profile image');

    if (errors.length > 0) {
      return res.status(400).json({ error: { errorMessage: errors } });
    }

    try {
      const existingUser = await registerModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          error: { errorMessage: ['Email is already registered'] }
        });
      }

      // ✅ Read and store the image as a buffer
      const imageBuffer = fs.readFileSync(imageFile.filepath);

      const newUser = await registerModel.create({
        userName,
        email,
        password: await bcrypt.hash(password, 10),
        image: {
          data: imageBuffer,
          contentType: imageFile.mimetype
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

      const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'None'
      };

      return res.status(201).cookie('authToken', token, options).json({
        successMessage: 'Registration successful',
        image: {
      contentType: newUser.image?.contentType,
      data: newUser.image?.data?.toString('base64')
    },
        token
      });

    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({
        error: { errorMessage: ['Internal Server Error'] }
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
                              registerTime : checkUser.createdAt
                         }, process.env.SECRET,{
                              expiresIn: process.env.TOKEN_EXP
                         }); 
      const options = { expires : new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000 )}
      
     res.status(200).cookie('authToken', token, options).json({
  successMessage: 'Your Login Successful',
  token,
  user: {
    id: checkUser._id,
    email: checkUser.email,
    userName: checkUser.userName,
    image: {
      contentType: checkUser.image?.contentType,
      data: checkUser.image?.data?.toString('base64')
    }
  }
});


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