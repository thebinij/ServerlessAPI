import mongoose, { Schema } from "mongoose";

export const Article = mongoose.model('Posts', new Schema({
    dateCreated: {type:Date, required:true},
    dateUpdated: {type:Date||null},
    authorId: {type:String},
    authorName: {type: String, required: true},
    metaTitle: {type:String, required: true},
    metaDescription: {type:String, required: true},
    metaImage: {type:String, required: true},
    metaTag: {type:String, required: true},
    similarTags: [String],
    topicClass: {type:String, required: true},
    content: [String],
    contentLength:  {type: Number, default:0},
    comments: [String],
    commentCount:  {type: Number, default:0},
    likeCount: {type: Number, default:0},
}));


export const User = mongoose.model('User', new Schema({
    fullname: {type: String, default:''},
    email: {type: String, required:true},
    password: {type: String, required:true},
}));