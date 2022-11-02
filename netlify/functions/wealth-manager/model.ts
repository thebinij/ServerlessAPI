import mongoose, { Schema } from "mongoose";

export const Expense = mongoose.model('Expense', new Schema({
    date: Date,
    type: String,
    method: String,
    description: String,
    amount:Number
}));
