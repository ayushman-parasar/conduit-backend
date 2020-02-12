var express = require('express');
var router = express.Router();
var Article = require('../../models/Article')
var slugit = require("slug")
var auth = require('../../modules/auth')
var Comment = require('../../models/Comment')
var User = require('../../models/User')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//Showing all article --incomplete had to work with author query parameters
router.get('/', (req,res)=>{
   try {
       if(req.query){
           const query = req.query
           if(query.tag){
               Article.find({taglist:query.tag},(err,article)=>{
                   if(err) return next(err)
                   res.send(article)
               })
           }else if(query.author){
                User.findOne({username:query.author})
                .populate("articlesCreated")
                .exec((err,data)=>{
                    if(err){
                        console.log("query-tag-err",err)
                    }
                    res.send(data.articlesCreated)
                })
           }else{
               Article.find({},(err,articles)=>{
                   if(err) return next(err)
                   res.send(articles)
               })
           }
        //    var articlelist = await Article.find({})
        console.log()
       }
       
       res.json(articlelist)
      
       
   } catch (error) {
       console.log("no articles found")
   }
})

//Showing single article
router.get('/:slug', async(req, res)=>{
    try {
        console.log("trying to find",req.params.slug)
        var toFind = req.params.slug 
        var singleArticle = await Article.findOne({slug:toFind})
        res.json(singleArticle)
    } catch (error) {
        console.log("No article found")
    }
    // Article.findOne({slug: toFind},(err,article)=>{
    //     if(err){
    //         console.log("No article found")
    //     }
    //     res.send(article)
    // })
})


//posting an article
router.post('/',auth.verifyToken,async(req, res)=>{
    try {
        var {email} = req.user
        var title = req.body.title
        // var slug  = slugit(title)
        var taglistmodified = req.body.taglist.split(',')
        req.body.taglist = taglistmodified
         //taglist is an array of indivitual strings
        req.body.slug = slug;
        var createdArticle = await Article.create(req.body)
        var currentUser = await User.findOne({email:email})
        currentUser.articlesCreated.push(createdArticle.id)
        await currentUser.save();
        res.json({"article created successfully":createdArticle})
    } catch (error) {
        console.log('create article err',error)
    }
})

// Updating an article
router.put('/:slug',auth.verifyToken, async(req, res)=>{
    try {
        var toFind  = req.params.slug
        console.log(req.body)
        // var article = await Article.findOneAndUpdate({slug:toFind},req.body,{new:true})
        var article = await Article.findOne({slug:toFind})
        article.title = req.body.title;
        article.description = req.body.description;
        article.taglist.push(req.body.taglist)
        await article.save()
        res.send(article)
    } catch (error) {
        console.log("update article err",error)
    }    
})
// deleting an article
router.delete('/:slug',auth.verifyToken,async (req, res)=>{
    try {
        var toFind  = req.params.slug;
        var deletedArticle = await Article.findOneAndDelete({slug:toFind})
        res.status(200).send(deletedArticle)
    } catch (error) {
        console.log("deletion  err",error)
    }
    // Article.findOneAndDelete({slug:toFind},(err,del)=>{
    //     if(err){
    //         console.log("dele err")    
    //     }
        
    // })
})
// Adding a comment
router.post('/:slug/comments',auth.verifyToken, async(req, res)=>{
    try {
        req.body.authorId = req.user.userID
        var commentCreated = await Comment.create(req.body);
        console.log("commentCreated",commentCreated)
        var commentedArticle = await Article.findOneAndUpdate({slug: req.params.slug},{$push:{comments: commentCreated.id }})
        // await commentedArticle.save()
        // console.log("commentedArticle",commentedArticle)
        res.json({commentedArticle}) //its updating in the mongo but not showing
    } catch (error) {
        console.log(error); 
    }
})

// Get Comments from an Article
router.get('/:slug/comments', (req, res, next)=>{
    
        Article.findOne({slug:req.params.slug})
        .populate('comments')
        .exec((err,data)=>{
            if(err){
                return next(err);
                
            }
            console.log(data);
            res.json({data})
        })
})
// deleting comment 
router.delete('/:slug/comments/:id',async (req, res)=>{
    try {
        var deleted = await Comment.findOneAndDelete({_id:req.params.id})
        res.send("deleted successfully")
    } catch (error) {
        console.log(error)
    }
})
// favourite article
router.post("/:slug/favourite",auth.verifyToken, async(req, res)=>{
    try {
        var {email} = req.user;
        var favArticle = await Article.findOne({slug:req.params.slug});
        favArticle.favourite=true;
        await favArticle.save();
        var user =  await User.findOne({email:email});
        await user.favouriteArticles.push(favArticle._id);
        user.save();
        console.log(user)
        res.json({user})
        // console.log(User)

    } catch (error) {
        console.log(error)
    }
})
// deleting a favourite
router.delete("/:slug/favourite",auth.verifyToken, async(req, res)=>{
    try {
        var favArticle = await Article.findOne({slug:req.params.slug});
        favArticle.favourite=false;
        await favArticle.save();
        var {email}= req.user
        var user = await User.findOne({email:email});
        // for(let i = 0; i < user.favouriteArticles.length; i++){
        //     if(user.favouriteArticles[i]===favArticle.id){
        //         let num = 
        //     }
        // }
        const index = user.favouriteArticles.indexOf(favArticle.id)
        if (index > -1) {
            await user.favouriteArticles.splice(index, 1);
          }
        user.save()
        console.log(user)
        res.json(user);
    } catch (error) {
        
    }
})

// feed
// router.get('/feed',auth.verifyToken,async (req, res, next)=>{
//     try {
//         console.log("test feed")
//         var {email} = req.user
//         var curUser =  await User.findOne({email:email})
//         let followedArticles = await Article.find({
//         authorId:{
//             $in:curUser.followingArr
//             }
//         })
//         console.log(followedArticles)
//         res.json(followedArticles)

//     } catch (error) {
//         console.log(error)
//     }
    
// })


// nested population
router.get('/feed',auth.verifyToken,(req, res, next)=>{
    
    var id =req.user.userID
    User.findById(id)
    .populate({
        path:"followingArr",
        populate:{
            path:"articlesCreated"
        }
    }).exec((err,data)=>{
        if(err) return next(err);
        res.json(data) 
    })
})

module.exports = router;