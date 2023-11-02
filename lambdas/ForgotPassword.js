const responses = require('../utils/Responses')
const dbConnection = require('../utils/db');
const constants = require('../utils/constants')

exports.handler = async event => {
    console.log("event", event)
    const {email} = JSON.parse(event.body)
    if(!email){
        return responses._400("email is missing")
    }
    const connection = await dbConnection.getConnection()
    try{

    const randmon6DigitNumber = generateRandom6DigitCode()
    sendEmail(randmon6DigitNumber)
    const result = await connection.execute(
        `INSERT INTO ${constants.tables.FORGOT_PASSWORD} (email,code) VALUES (?, ?) ON DUPLICATE KEY UPDATE
        email = ?,
        code = ?`,
        [email,randmon6DigitNumber, email,randmon6DigitNumber]
      )
    return responses._200(null, "Email sent successfully!")

    }

 catch (error) {
    console.error('Error:', error);
    return responses._400(error.message)
} finally {
     connection.release();
}

    
}

function generateRandom6DigitCode() {
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode.toString(); // Convert the number to a string
  }

function sendEmail(code){
    console.log("Sending email...")
}