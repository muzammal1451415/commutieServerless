const aws = require('aws-sdk')
const dynamo = new aws.DynamoDB.DocumentClient()

async function put(tableName, item){
    await dynamo.put({
        TableName: tableName,
        Item: item
    }).promise()
}

module.exports = {
    put
};