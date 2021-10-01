// 1. import mongoose
const mongoose = require("mongoose");
const DB1 = "post_db";

// 2. connect mongoose to MongoDB
mongoose.connect("mongodb://localhost/" + DB1, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
    .then( () => console.log(` --> connected to ${DB1} db 🎈`))
    .catch( (err) => console.log(`error connecting to ${DB1}`, err))