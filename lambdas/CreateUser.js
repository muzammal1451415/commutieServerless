
const responses = require('../utils/Responses')
const dbConnection = require('../utils/db');

exports.handler = async event => {
    console.log("Event",event)
    var {name,gender,email,password,location_text,location_lat,location_long,phone_number,login_by} = JSON.parse(event.body)
    if(!name || !gender || !email || !password || !login_by){
        return responses._400("Some fields are missing")
    }

    const connection = await dbConnection.getConnection()
    try {

        await connection.execute(
            'Call InsertUserData(?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, gender, email, password, location_text || "",location_long || 0.0, location_lat || 0.0 , phone_number || "", login_by]
          )

          return responses._200(null,"User created successfully!")
        // Process the results
    } catch (error) {
        console.error('Error:', error);
        return responses._400(error.message)
    
    } finally {
         connection.release();
    }


    
}