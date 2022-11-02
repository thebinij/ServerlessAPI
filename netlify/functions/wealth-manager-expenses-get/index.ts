import {Handler} from '@netlify/functions';
import * as dotenv from 'dotenv';
import { connectDB } from '../wealth-manager/database';
import { Expense } from '../wealth-manager/model';
dotenv.config();

const URI = process.env['MONGO_URI'] || ''

const handler:Handler = async function (event,context) {
    if(event.httpMethod == 'GET'){    
        await connectDB(URI)
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



  