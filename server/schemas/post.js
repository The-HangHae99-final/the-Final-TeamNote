const mongoose = require("mongoose");
const { Schema } = mongoose; 

const postSchema = new Schema({
    post_id: { type: Number, required: true, unique: true }, 
    user_id: { type: String, required: true },  
    title: { type: String, required: true }, 
    content: { type: String, required: true }, 
    category: { type: Number, required: true, }, 
}, { 
    timestamps: true
});

module.exports = mongoose.model("Post", postSchema);