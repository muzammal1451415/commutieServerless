
const Responses = {
    _200(data = {}, message = "Success"){
        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*"
            },
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message:message,
                data:data
            })
        }
    },

    _400(message = ""){
        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*"
            },
            statusCode: 400,
            body: JSON.stringify({
                success:false,
                message: message,
                data: null
            })
        }
    },

    _500(){
        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*"
            },
            statusCode: 500,
            body: JSON.stringify({
                success:false,
                message: "Unauthorized",
                data: null
            })
        }
    },
};

module.exports = Responses;