import {Handler} from '@netlify/functions';
import * as dotenv from 'dotenv';
import { connectDB } from '../wealth-manager/database';
import { Expense } from '../wealth-manager/model';
dotenv.config();

const URI = process.env['MONGO_URI'] || ''

const handler:Handler = async function (event,context) {
  console.log(event.httpMethod,event.body,event.headers )
    if(event.httpMethod == 'POST'){
    await connectDB(URI)

       const newExpense = new Expense({ date: new Date(), type:'Travel', method: 'Digital Wallet', description: 'Travel Food', amount:22500  });
       newExpense.save();
  }
    return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow from anywhere 
      },
        body: JSON.stringify({
            "success": "true"
        }),
    }
    // const data = JSON.parse(event.body)
    // const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '')
    // const segments = path.split('/').filter(e => e)
    // console.log("path ",path)
    // console.log("segments ",segments)
 
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