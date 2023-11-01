 'use strict';

// module.exports.hello = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };

const dbConnection = require('./utils/db');
const response = require('./utils/Responses')

module.exports.hello = async (event, context) => {

    const connection = await dbConnection.getConnection();
    try {
      
        // Perform database operations
        const [rows, fields] = await connection.execute('SELECT * FROM User');

        console.log("rows",rows)
        response._200(rows)
        // Process the results
    } catch (error) {
        console.error('Error:', error);
    } finally {
         connection.release();
    }
};
