const express = require('express');
const router = express.Router();
const User = require('../models/users')
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');
const { find, findOne, findById } = require('../models/users');



router.get('/', verifyToken,async(req, res) => {


	try {
		
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(400).json({success:false,message:'uesr is not exeting'})
		}
		
		res.json({success:true,user:user})
	} catch (error) {
		

		
	}
})


// router api/auth/register

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
	const { username, password } = req.body

	// Simple validation
	if (!username || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Missing username and/or password' })

	try {
		// Check for existing user
		const user = await User.findOne({ username })

		if (user)
			return res
				.status(400)
				.json({ success: false, message: 'Username already taken' })

		// All good
		const hashedPassword = await argon2.hash(password)
		const newUser = new User({ username, password: hashedPassword })
		await newUser.save()

		// Return token
		const accessToken = jwt.sign(
			{ userId: newUser._id },
			process.env.ACCESS_TOKEN_SECRET
		)

		res.json({
			success: true,
			message: 'User created successfully',
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


// @route POST api/auth/login
// @desc login user
// @access Public

router.post('/login', async(req,res)=>{
const {username, password } = req.body;
//simple validation
if(!username||!password){
    res.status(400).json({success:false,message:"missing username and/or password"})
}
try {
    const user = await User.findOne({username:username});
    if(!user){

       return  res.status(400).json({success:false, message:'Incorrect username or password '})
    }
        //validation password
        const passwordvalida = await argon2.verify(user.password, password)
        if(!passwordvalida){
            return  res.status(400).json({success:false, message:'Incorrect username or password '})
        }

        //all goot
        //return accesstoken
        const accessToken = await jwt.sign({userId:user._id},process.env.ACCESS_TOKEN_SECRET)
        res.json({
            success:true,
            message:'user login in successfully',
            accessToken
        })

} catch (error) {
    console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    
	}
	// @route POST api/auth/update
// @desc update  user
// @access private
	router.put('/update', verifyToken, async(req, res) => {
		const {_id, username, password, oldpassword} = req.body
		if (!username || !password || !oldpassword) {
			
			 return res.status(400).json({success:false,message:"missing username and/or password"})
			
		} 
			
		

		try {
			const user = await User.findOne({ _id:_id })
			console.log(user)
			const verify = await argon2.verify(user.password, oldpassword)
			if (!verify) {
				return res.json({success:false, message:'Incorrect user name or oldpassword '})
			}
		
			const haspass = await argon2.hash(password)

			const userupdate = {
				username: username,
				password:haspass

			}
			const authupdatecondision = {_id: _id}
			const update = await User.findOneAndUpdate(authupdatecondision, userupdate)
			if (!update) {
							return res.status(401).json({
				success: false,
				message: 'user not found or user not authorised'
			})
			}
			return res.json({success:true, message:"update user successfully", user:userupdate})
		} catch (error) {
					console.log(error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
			
		}
	})

})

module.exports = router;