const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const User = require("../../models/User");
const gravatar=require('gravatar');

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter valid Password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
       return res.status(400).json({ error: error.array() });
    }

    const { name, email, password } = req.body;

    try {
      //    See if user exits
            let user=await User.findOne({email:email});
            if(user){
                return res.status(400).json({error:[{msg:'User already exists'}]})
            }
      //    Get user gravatar
            const avatar=gravatar.url(email,{
                s:'200',
                r:'pg',
                d:'mm'
            })

            user =new User({
                name,
                email,
                password,
                avatar
               });
      //    Encrypt password
            const salt=await bcrypt.genSalt(10);

            user.password=await bcrypt.hash(password,salt);

            await user.save();
      //    Return jsonwebtoken
            const payload={
                user:{
                    id:user.id
                }
            }
            jwt.sign(payload,
                process.env.jwtSecret,
                {expiresIn:360000},
                (err,token)=>{
                   if(err) throw err;
                   res.json({token})
                }
                );
            // res.send("User registered");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
