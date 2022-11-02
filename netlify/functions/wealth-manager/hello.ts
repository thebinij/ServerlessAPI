import {Handler} from '@netlify/functions';
const handler:Handler = async function (event,context) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello From Wealth Manager App"
        })
    }
}

export { handler}