const responses = require('../utils/Responses')
const dbConnection = require('../utils/db');
const auth = require('../utils/jwt_auth')
exports.handler = async event => {
  console.log('event', event)

  const token = event.headers.authorization;
    try{
      const {email} = auth.verifyToken(token)

        const {from_location_text, from_location_lat,from_location_long, from_location_time, to_location_text,
        to_location_lat,to_location_long, to_location_time,waypoints,
        phone_number, person_capacity, gender, provider_type,schedule_type, vehicle_type, fare, vehicle_images} = JSON.parse(event.body)


        if(!from_location_text){
            return responses._400("from_location_text is missing")
        }
        if(!from_location_lat){
            return responses._400("from_location_lat is missing")
        }
        if(!from_location_long){
          return responses._400("from_location_long is missing")
        }
        if(!from_location_time){
            return responses._400("from_location_time is missing")
        }


        if(!to_location_text){
            return responses._400("from_location_text is missing")
        }
        if(!to_location_lat){
            return responses._400("to_location_lat is missing")
        }
        if(!to_location_long){
          return responses._400("to_location_long is missing")
        }


        if(!phone_number){
            return responses._400("phone_number is missing")

        }

        if(!person_capacity){
            return responses._400("person_capacity is missing")
        }
    
        if(!provider_type){
            return responses._400("provider_type is missing")
        }

        if(!vehicle_type){
            return responses._400("vehicle_type is missing")
        }

        if(!schedule_type){
            return responses._400("schedule_type is missing")
        }

        if(!fare){
            return responses._400("fare is missing")
        }




        const connection = await dbConnection.getConnection()

        try{

      
       await connection.beginTransaction()
       await connection.query(
          'CALL InsertCommuteData(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, @commute_id)',
          [
              email,
              phone_number,
              person_capacity,
              gender,
              provider_type,
              schedule_type,
              vehicle_type,
              fare,
              from_location_text,
              from_location_time,
              to_location_text,
              to_location_time,
              from_location_lat,
              from_location_long,
              to_location_lat,
              to_location_long
          ]);
      const [result] = await connection.query('SELECT @commute_id as commuteID');
      const commuteID = result[0].commuteID 
      if(vehicle_images){
          for(let i = 0 ; i< vehicle_images.length; i++){
            await connection.query('CALL InsertImages(?,?)',[commuteID,vehicle_images[i]])
       }}
     
        if(waypoints){
          for(let i = 0 ; i< waypoints.length; i++){
            await connection.query('CALL InsertWaypoints(?,?,?,?,?)',[commuteID,waypoints[i].text,waypoints[i].lat,waypoints[i].long,waypoints[i].time ])
        }}
      await connection.commit()
      connection.release();
    return responses._200(null,"Commute created successfully!")

    }catch (error) {
      console.error('Error:', error);
      if(connection){
        await connection.rollback()
        connection.release();
      }
      return responses._400(error.message)
    }




      }catch(error){
        console.log("error",error)
        return responses._500()
    }



}

