const Post = require("../models/Post") 

module.exports = {
    // READ ALL ------------------------------
    findAll: (req, res) => {
        Post.find()
            .then(allPosts => {
                //console.log("allPosts ->", allPosts);
                res.json({allPostsArray: allPosts})
            })
            .catch(err => {
                console.log(err)
                res.status(400).json({message: "error", error:err})
            });
    },
    // READ ONE --------------------------------
    findOne: (req, res) => {
        console.log("🎈 req.params.id =>", req.params.id);
        Post.findById(req.params.id)
            .then(post => {
                console.log("retrieved one post: ", post);
                res.json(post)})
            .catch(err => {
                console.log("couldn't find obj ⚠⚠⚠");
                res.status(400).json({message: "error", error:err})
            })
    },
    // CREATE -----------------------------------
    createPost: (req, res) => {
        Post.create(req.body)
            .then(newPost => res.json(newPost))
            .catch(err => res.status(400).json(err))
    },
    // UPDATE ------------------------------
    updatePost : (req, res) => {
        Post.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
            .then(updatedPost => res.json(updatedPost))
            .catch(err => res.status(400).json(err))
    },
    // DELETE --------------------------------
    deletePost : (req, res) => {
        Post.findByIdAndDelete(req.params.id)
            .then(result => {
                res.json({result: result})
            })
            .catch(err => {
                console.log("🔴🔴🔴 ERROR", req.params.id);
                res.status(400).json(err)
            })
    }
}