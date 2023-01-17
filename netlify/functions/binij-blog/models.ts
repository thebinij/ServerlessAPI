import mongoose, { Schema } from "mongoose";

export const Gallery = mongoose.model('Gallery', new Schema({
    title: {type:String},
    date: {type:Date},
    images: [{
        largeURL:{type:String},
        thumbnailURL:{type:String},
        width: {type: Number},
        height: {type: Number},
        caption: {type: String}
    }]
 }));
 
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
    content: {type:[String],required:true},
    contentLength:  {type: Number, default:0},
    viewCount: {type: Number, default:0},
    pathName: {type:String}
}));

export const Song = mongoose.model("Audios", new Schema({
    songId: {type:String, required:true},
    audioName: {type:String,required:true},
    artists:[String],
    playCount:{type: Number, default:0},
    likeCount: {type: Number, default:0},
    releaseDate: {type:String, required:true},
    audioSrc: {type:String,required:true},
    albumImg: {type:String,required:true}
}))


export const User = mongoose.model('User', new Schema({
    fullname: {type: String, default:''},
    email: {type: String, required:true},
    password: {type: String, required:true},
    lastLogin:{type:String}
}));