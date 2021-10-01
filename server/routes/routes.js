const Post = require("../controllers/Post.controller");

module.exports = (app) => {
    app.get("/api/posts", Post.findAll);
    app.get("/api/posts/:id", Post.findOne);
    app.post("/api/posts", Post.createPost);
    app.put("/api/posts/:id", Post.updatePost);
    app.delete("/api/posts/:id", Post.deletePost);
}