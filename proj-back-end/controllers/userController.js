const AWS = require('aws-sdk');
const {region, tables} = require('../config');

AWS.config.update({region})

const docClient = new AWS.DynamoDB.DocumentClient({
    sslEnabled: false,
    paramValidation: false,
    convertResponseTypes: false
})
const db = new AWS.DynamoDB();

async function listAllUsers() {

    let params = {TableName: tables.users};
    let results = [];
    let items;
    let users = [];

    do {
        items = await docClient.scan(params).promise();
        items.Items.forEach((item) => results.push(item));
        users.push(items.Items[0]['email'])
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");

    return users;
}



exports.addUser = async (req, res) => {

    const {email} = req.body;
    const params = {
        TableName: tables.users,
        Item: {
            email: {S: email}
        }
    }

    db.putItem(params, ((err, data) => {
        if (err) {
            console.log("Error Happened While saving the user: " + err)
            return res.status(500).send(err);
        } else {
            res.status(200).send("User Added to the DB: " + email);
        }
    }))
}