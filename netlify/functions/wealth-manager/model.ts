import mongoose, { Schema } from "mongoose";

export const Expense = mongoose.model('Expense', new Schema({
    date: Date,
    type: String,
    method: String,
    description: String,
    amount:Number
}));

export const User = mongoose.model('User', new Schema({
    fullname: String,
    email: String,
    password: String
}));
