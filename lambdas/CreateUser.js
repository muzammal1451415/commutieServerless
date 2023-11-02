
const responses = require('../utils/Responses')
const dbConnection = require('../utils/db');

exports.handler = async event => {
    console.log("Event",event)
    var {name,gender,email,password,location_text,location_latlong,phone_number,login_by} = JSON.parse(event.body)
    if(!name || !gender || !email || !password || !login_by){
        return responses._400("Some fields are missing")
    }

    const connection = await dbConnection.getConnection()
    try {
      
        const result = await connection.execute(
            'INSERT INTO User (name, gender, email, password, location_text, location_latlong, phone_number, login_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, gender, email, password, location_text || null, location_latlong || null , phone_number || null, login_by]
          )

          const data = {
            message:"User Created Successfully!",
            data: result
          }

          return responses._200(data)
        // Process the results
    } catch (error) {
        console.error('Error:', error);
        return responses._400(error.message)
    } finally {
         connection.release();
    }


    
}