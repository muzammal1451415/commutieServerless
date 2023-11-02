const responses = require('../utils/Responses')
const dbConnection = require('../utils/db');
const auth = require('../utils/jwt_auth')
const constants = require('../utils/constants')

exports.handler = async event => {

    console.log('event',event)

    const{email,password,login_by} = JSON.parse(event.body)
    
    if(!email){
        return responses._400("Email is missing")
    }

    if(!login_by){
        return responses._400("Login by is missing")
    }

    const connection = await dbConnection.getConnection()

    try {
        
        // Checking email availability
        const [rows] = await connection.execute('SELECT 1 FROM User WHERE email = ?', [email]);
        //return responses._200(rows)
        if(rows.length < 1){
            return responses._400("${email} is not found")
        }

        if(login_by !== constants.loginBy.GENERAL){

            const token = auth.generateToken(email)
            return responses._200({token: token})
            
        }else{

            if(!password){
                return responses._400("Password is missing")
           `` }
            // Checking email and password validity
            const [record] = await connection.execute('SELECT * FROM User WHERE email = ? AND password = ?', [email, password]);
            if(record.length < 1){
                return responses._400("Email or Password is wrong")
            }
            const token = auth.generateToken(email)
            return responses._200({token: token})


        }

        
    } catch (error) {
        console.error('Error:', error);
        return responses._400(error.message)
    } finally {
         connection.release();
    }


    
    
}