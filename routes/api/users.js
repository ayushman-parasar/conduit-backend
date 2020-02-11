var express = require('express');
var router = express.Router();
var User = require('../../models/User')
var auth = require('../../modules/auth')

/* GET home page. */
router.post('/',async (req, res)=>{
    try{
        var user = await User.create(req.body)
        res.json(user)
    }catch(error){
        console.log("err",error)
    }
})
//validate password so that it cannot take empty password and also it shouldnot take space as a password


router.post('/login', async (req, res)=>{
    try{
        var{email, password} = req.body;
        var user = await User.findOne({email})
        if(!user) res.status(404).send("user not found")
        var result = await user.verifyPassword(password)
        if(!result) res.status(500).send("wrong password")
        var token = await auth.generateJWT(user)
        user.token = token
        // res.send("success")
        user.save()
        res.json(token)
    }catch(error){
        console.log("err",error)
    }
})

// ---------------------------------user---------------------------------------------------
// // Get current User
// router.get("/", auth.verifyToken, async(req, res)=>{
//    try {
//     var currentUser = await User.findOne({email:req.body.verification.email})
//     res.json(currentUser)
//    } catch (error) {
//        console.log("current user ",error)
//    }
// })

// router.put('/',auth.verifyToken, async(req, res)=>{
//     try {
//         var toFind = req.body.verification.email;
//         var foundUser = await User.findOne({email:toFind})
//         var updatedUser = await foundUser.updateOne(req.body)
//         updatedUser.save
//         res.json(updatedUser)
//     } catch (error) {
//         console.log('updated user err',error)
//     }
// })
// find store in a val
// user.

module.exports = router;
