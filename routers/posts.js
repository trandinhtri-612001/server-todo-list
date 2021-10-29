const express = require('express');
const router = express.Router();

const Post = require('../models/Posts');

const verifyToken = require('../middleware/auth');




//@ router /api/post
//@ creat post
router.post('/', verifyToken, async(req,res)=>{
    const {title, description, url, status} =req.body

    if(!title)
    res.status(400).json({success:false, message:"title is required"});
    try {
        

const newPost = new Post({
    title:title,
    description:description,
    url: url.startsWith('https://') ? url : `https://${url}`,
    status: status || 'TO LEARN',
    user:req.userId})
await newPost.save();

     res.json({ success: true, message: 'post save successfully', post: newPost })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// router /api/post
// get post

router.get('/',verifyToken, async(req,res)=>{
    try {
        const posts = await Post.find({user:req.userId}).populate('user',['username']);
        res.json({success:true, posts})
    } catch (error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' ,error:error})
        
    }
})

// router /api/post/:id;
// update post

router.put('/:id', verifyToken, async (req, res) => {
	const { title, description, url, status } = req.body

	// Simple validation
	if (!title)
		return res
			.status(400)
			.json({ success: false, message: 'Title is required' })

	try {
		let updatedPost = {
			title,
			description: description || '',
			url: (url.startsWith('https://') ? url : `https://${url}`) || '',
			status: status || 'TO LEARN'
		}

		const postUpdateCondition = { _id: req.params.id, user: req.userId }

		updatedPost = await Post.findOneAndUpdate(
			postUpdateCondition,
			updatedPost,
			{ new: true }
		)

		// User not authorised to update post or post not found
		if (!updatedPost)
			return res.status(401).json({
				success: false,
				message: 'Post not found or user not authorised'
			})

		res.json({
			success: true,
			message: 'Excellent progress!',
			post: updatedPost
		})
	} catch (error) {
		
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// router /api/post/:id
//delete post

router.delete('/:id',verifyToken, async(req,res)=>{
try {
    
	const postdeleteCondition = { _id: req.params.id, user: req.userId }
     const deletedpost =await Post.findOneAndDelete(postdeleteCondition) 

     if (!deletedpost)
     return res.status(401).json({
         success: false,
         message: 'Post not found or user not authorised'
     })

     res.json({success:true,
        deletedpost
    })

} catch (error) {
    
	return	res.status(500).json({ success: false, message: 'Internal server error' })
    
}
})

module.exports = router;
