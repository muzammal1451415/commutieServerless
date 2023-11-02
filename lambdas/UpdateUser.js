const responses = require('../utils/Responses')
const dbConnection = require('../utils/db');
const auth = require('../utils/jwt_auth')
const constants = require('../utils/constants')

exports.handler = async event => {

    console.log('event', event)

    const token = event.headers.authorization;
    try{

    const {email} = auth.verifyToken(token)
    const {name,gender,old_password,new_password,phone_number} = JSON.parse(event.body)

    const updatableFields = []
    if (name) updatableFields.push(`name = '${name}'`)
    if (gender) updatableFields.push(`gender = '${gender}'`)
    if (new_password) updatableFields.push(`password = '${new_password}'`)
    if (phone_number) updatableFields.push(`phone_number = '${phone_number}'`)

    if(updatableFields.length == 0){
        return responses._400("No field provided for update")
    }
    if(old_password && !new_password){
        return responses._400("new_password is missing")
    }

    if(!old_password && new_password){
        return responses._400("old_password is missing")
    }
    const connection = await dbConnection.getConnection()

    try{

    if(!old_password && !new_password){
        // dont need to check password matching bcz they are not provided
        
        const updateSql = `UPDATE ${constants.tables.USER} SET ${updatableFields.join(', ')} WHERE email = ?`;
        const [result] = await connection.execute(updateSql, [email]);
        return responses._200(null, "Your information updated successfully!")

    }else{

        const sql = `SELECT password FROM ${constants.tables.USER} WHERE email = ?`;
        const [passwordResults] = await connection.execute(sql, [email]);
        if(passwordResults.length == 0){
            return responses._400("user is not found")
        }
        const oldPasswordFromDatabse = passwordResults[0].password
        if(old_password !== oldPasswordFromDatabse){
            return responses._400("Old password does not match")
        }

        const updateSql = `UPDATE ${constants.tables.USER} SET ${updatableFields.join(', ')} WHERE email = ?`;
        const [result] = await connection.execute(updateSql, [email]);

        return responses._200(null, "Your information updated successfully!")


    }
}catch (error) {
    console.error('Error:', error);
    return responses._400(error.message)
} finally {
     connection.release();
}



}catch(error){
    console.log("error",error)
    return responses._500()
}

}