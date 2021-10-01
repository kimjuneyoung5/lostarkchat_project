const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    creator:{
        type:String,
        required: [true, "{PATH} must be present"],
        minlength: [3, "{PATH} must be at least 3 chars long"]
    },
    title: {
        type: String,
        required: [true, "{PATH} must be present"],
        minlength: [3, "{PATH} must be at least 3 chars long"]
    },
    image: {
        type: String,
        required: [false]
    },
    description : {
        type: String,
        required: [true, "{PATH} must be present"],
        minlength: [5, "{PATH} must have more than 5 chars"]
    },
    like : {
        type: Boolean,
        default: false
    }
},{timestamps: true});

// make the schema and export
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;