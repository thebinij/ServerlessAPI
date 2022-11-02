import {Handler} from '@netlify/functions';
import mongoose, { Schema } from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const URI = process.env['MONGO_URI'] || ''

const handler:Handler = async function (event,context) {
    if(event.httpMethod == 'GET'){    
        await connectDB()
        const Expense = mongoose.model('Expense', new Schema({
            date: Date,
            type: String,
            method: String,
            description: String,
            amount:Number
        }));

    const allexpenses = await Expense.find();
    return {
        statusCode: 200,
        body: JSON.stringify({
            allexpenses
        }),
        headers: { 'access-control-allow-origin': '*' }
      }
    }
    return {
      statusCode: 400,
      body: JSON.stringify({
          "Bad Request": "true"
      }),
      headers: { 'access-control-allow-origin': '*' }
    }

    // const data = JSON.parse(event.body)
    // const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '')
    // const segments = path.split('/').filter(e => e)
    // console.log("path ",path)
    // console.log("segments ",segments)
    //     const newExpense = new Expense({ date: new Date(), type:'Groceries', method: 'Cash', description: 'Home Food', amount:2500  });
    //     newExpense.save();

    //   const allUsers = await Expense.find();
//   console.log(allUsers);
// const newExpense = new Expense({ date: new Date(), type:'Utilities', method: 'Credit Card', description: 'Landline Bill', amount:500  });

// newExpense.save(function(err,data){
// if (err) return {
//     statusCode: 400,
//     body: JSON.stringify(err)
// }
// return {
//     statusCode: 200,
//     body: JSON.stringify(data),
//   };
// });
}

export { handler}


const connectDB = async () => {
    try {
      await mongoose.connect(URI)
      console.log('MongoDB connected!!')
    } catch (err) {
      console.log('Failed to connect to MongoDB', err)
    }
  }
  