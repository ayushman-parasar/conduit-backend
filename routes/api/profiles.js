var express = require('express');
var router = express.Router();
var User = require('../../models/User')
var auth = require('../../modules/auth')

// get profile
router.get('/:username',async (req, res)=>{
    try {
        var profile = await User.findOne({username:req.params.username},{username:1,email:1,bio:1,following:1})
        res.json({profile})
    } catch (error) {
        console.log("profile get",error)
    }
})
// follow user
router.post('/:username/follow',auth.verifyToken, async(req, res)=>{
   
    try {
        var followUser = await User.findOne({username:req.params.username})
        followUser.following = true;
        await followUser.save();
        var {email} = req.user
        var user = await User.findOne({email:email})
        await user.followingArr.push(followUser._id)
        user.save()
        res.json({user})
        
    } catch (error) {
        console.log(error)
    }
})
// unfollow user
router.delete('/:username/follow',auth.verifyToken, async(req, res)=>{
    try {
        var unfollowUser = await User.findOne({username:req.params.username})
        unfollowUser.following = false;
        await unfollowUser.save()
        var {email} = req.user
        var user = await User.findOne({email:email})
        user.save()
        const index = user.followingArr.indexOf(unfollowUser.id)
        if (index > -1) {
            await user.followingArr.splice(index, 1);
          }
        res.json({user})
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;
