const responses = require('../utils/Responses')
const dbConnection = require('../utils/db');
const auth = require('../utils/jwt_auth')
exports.handler = async event => {
  console.log('event', event)

  const radius = event.queryStringParameters.radius || '1000';
  const location = event.queryStringParameters.location || '';

  console.log('radius', radius)
  console.log('location', location)



  const getLatLong = (string) => {
    const regex = /^(-?\d+\.?\d*),(-?\d+\.?\d*)$/;
    const match = regex.exec(string);
    if (match) {
      const latitude = parseFloat(match[1]);
      const longitude = parseFloat(match[2]);
      return { latitude, longitude };
    } else {
      return null;
    }
  };
  const token = event.headers.authorization;
    try{
      const {email} = auth.verifyToken(token)
      if(location === ''){
        responses._400("Please enter location (lat,long)")
      }

      const{latitude,longitude} = getLatLong(location)

      const connection = await dbConnection.getConnection()

      const result = await connection.query(
        'CALL GetCommutesByDistance(?,?,?)',
        [
            latitude,longitude,radius
        ]);
    
        console.log('result', result[0])

        return responses._200(result[0][0],null)

        


      }catch(error){
        console.log("error",error)
        return responses._500()
    }



}

