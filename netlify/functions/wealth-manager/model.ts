import mongoose, { Schema } from "mongoose";

export const Expense = mongoose.model('Expense', new Schema({
    userId: {type: String, required:true},
    date: {type:Date, required:true},
    type: {type: String, required:true},
    method: {type: String, required:true},
    description: {type: String, default:''},
    amount:{type: Number, min:0}
}));

export const User = mongoose.model('User', new Schema({
    fullname: {type: String, default:''},
    email: {type: String, required:true},
    password: {type: String, required:true},
    isVerfied: {type: Boolean, default: false},
    refreshTokens: [String]
}));


export const Stock = mongoose.model('Stock', new Schema({
    userId: {type: String, required:true},
    date: {type:Date, required:true},
    ticker: {type:String, required:true},
    actionType: {type: String, required: true},
    stockType: {type:String},
    quantity: {type: Number, min:0},
    costPrice: {type: Number, min:0},
    netCostPrice: {type: Number, min:0},
    soldPrice: {type: Number, min:0},
    charges: {type: Number, min:0},
    taxes: {type: Number}
}));