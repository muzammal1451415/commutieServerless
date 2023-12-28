
const responses = require('../utils/Responses')
const dbConnection = require('../utils/db');
const dynamoDB = require('../utils/dynamodbClient')
const AWS = require('aws-sdk')
const uuid = require('uuid');


const ddb = new AWS.DynamoDB() 
const ddbGeo = require('@trufala/dynageo')
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'capitalsss');

// Instantiate the table manager
const capitalsManager = new ddbGeo.GeoDataManager(config);

// Use GeoTableUtil to help construct a CreateTableInput.
const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config);

// Tweak the schema as desired
createTableInput.ProvisionedThroughput.ReadCapacityUnits = 2;
exports.handler = async event => {
console.log('Creating table with schema:');
console.dir(createTableInput, { depth: null });

//await ddb.createTable(createTableInput).promise()

//return responses._200(null,"Table Created Successfully")
    // Wait for it to become ready
    // .then(function () { return ddb.waitFor('tableExists', { TableName: config.tableName }).promise() })
    // // Load sample data in batches
    // .then(function () {
        console.log('Loading sample data from capitals.json');
        const data = require('../utils/capitals.json');
        const putPointInputs = data.map(function (capital) {
            return {
                RangeKeyValue: { S: uuid.v4() }, // Use this to ensure uniqueness of the hash/range pairs.
                GeoPoint: {
                    latitude: capital.latitude,
                    longitude: capital.longitude
                },
                PutItemInput: {
                    Item: {
                        country: { S: capital.country },
                        capital: { S: capital.capital }
                    }
                }
            }
    
        });




        //await resumeWriting(putPointInputs,data)
        const result =  await capitalsManager.queryRadius({
            RadiusInMeter: 500000,
            CenterPoint: {
                latitude: 52.225730,
                longitude: 0.149593
            }
        })
        return responses._200({result:result},"Table Created Successfully")

    //     function resumeWriting() {
    //     }

    //     return resumeWriting().catch(function (error) {
    //         console.warn(error);
    //     });
    // })
    // // Perform a radius query
    // .then(function () {
    //     console.log('Querying by radius, looking 100km from Cambridge, UK.');
    //     return capitalsManager.queryRadius({
    //         RadiusInMeter: 100000,
    //         CenterPoint: {
    //             latitude: 52.225730,
    //             longitude: 0.149593
    //         }
    //     })
    // })
    // // Print the results, an array of DynamoDB.AttributeMaps
    // .then(console.log)
    // // Clean up
    // .then(function() { return ddb.deleteTable({ TableName: config.tableName }).promise() })
    // .catch(console.warn)
    // .then(function () {
    //     process.exit(0);
    // });

}

async function resumeWriting(putPointInputs,data) {
    for(let i=0; i< data.length; i++){
        await capitalsManager.putPoint(putPointInputs[i]).promise()
    }
}