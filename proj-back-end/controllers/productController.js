const formidable = require('formidable');
const fs = require('fs');
const {buckets, tables, region} = require('../config');
const AWS = require('aws-sdk');
AWS.config.update({region})
const db = new AWS.DynamoDB();

exports.getProductById = (req, res, next, id) => {

    if (!id) {
        return res.send("Invalid Id");
    }

    const getParams = {
        TableName: tables.products,
        Key: {
            id: {S: id}
        }
    }
    db.getItem(getParams, (err, result) => {
        if (err || !result) {
            return res.status(400).json({
                message: "Failed to get the product details for id " + id,
                error: err,
                operation: "failure"
            })
        } else {
            req.product = result.Item;
            next();
        }
    })

}

exports.getAProduct = (req, res) => {
    if (!req.product) {
        return res.status(400).json({
            message: "Failed to populate the product on request body",
            error: "Expected an object with properties instead got a empty object",
            operation: "failure"
        })
    } else {
        return res.status(200).json({
            message: "Product Details Found",
            data: req.product,
            operation: "success"
        })
    }
}

exports.listProducts = (req, res) => {
    const params = {TableName: tables.products};

    db.scan(params, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                message: "Failed to get all the product details",
                error: err,
                operation: "failure"
            })
        } else {
            return res.status(200).json({
                message: "Found the list of the products",
                data: data.Items,
                operation: "success"
            })
        }

    })
}

function uploadFileToS3(file, id, res) {
    if (file.image) {
        const s3 = new AWS.S3();
        const imageContent = fs.readFileSync(file.image.filepath)

        // create S3 params
        const params = {
            Bucket: buckets.productImages,
            Key: id + ".jpg",
            Body: imageContent,
            ContentType: file.image.mimeType,
            ACL: 'public-read'
        }

        s3.upload(params, (err, data) => {
            if (err) {
                console.log(err);
                return res.send("Failed to Upload the data")
            } else {
                console.log("File Uploaded Successfully to S3 at =>   " + `https://${buckets.productImages}.s3.amazonaws.com/${id}.jpg`);
            }
        })

    }
}

exports.createProduct = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    // Parse the form for data
    form.parse(req, (err, fields, file) => {

        if (err) {
            return res.status(400).json({
                message: "Problems found in the file you sent..." + file.image,
                error: err,
                operation: "failure"
            })
        }

        // De-Structure the fields
        const {id, name, description, price, stock} = fields;

        if (!id || !name || !description || !price || !stock) {
            return res.status(400).json({
                message: "Some fields missing or empty",
                error: "Insufficient data in non-file fields",
                operation: "failure"
            })
        }

        // Check the image size and should be < 4MB
        if (file.image && file.image.size > 4 * 1024 * 1024) {
            return res.status(406).json({
                message: "Failed to perform the operation",
                error: "Image size exceeded 4MB",
                operation: "failure"
            })
        }

        // Read the image and upload to s3
        uploadFileToS3(file, id, res);

        // Upload the product details to DynamoDB
        // Build DynamoDB Params
        const productParams = {
            TableName: tables.products,
            Item: {
                id: {S: id},
                name: {S: name},
                description: {S: description},
                price: {N: price.toString()},
                stock: {N: stock.toString()},
                url: {S: `https://${buckets.productImages}.s3.amazonaws.com/${id}.jpg`}
            }
        }

        db.putItem(productParams, (err, data) => {
            if (err) {
                console.log("Error Happened While creating the product: " + err)
                return res.status(500).json({
                    message: "Failed to create the product",
                    error: err,
                    operation: "failure"
                });
            } else {
                console.log(`Successfully Created the product ${name} with id: ${id}`);
                res.status(200).json({
                    message: `Successfully Created the product ${name} with id: ${id}`,
                    operation: "success"
                });
            }
        })

    })

}

exports.deleteProduct = (req, res) => {
    const id = req.product.id.S;
    if (!req.product) {
        return res.status(400).json({
            message: "Kindly send a valid product id",
            error: "No product found for the given id",
            operation: "failure"
        })
    }

    const params = {
        TableName: tables.products,
        Key: {
            id: {S: id.toString()}
        }
    };

    db.deleteItem(params, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                message: "Failed to delete the product",
                error: err,
                operation: "failure"
            })
        } else {
            return res.status(200).json({
                message: "Successfully Deleted the product with id: " + id,
                operation: "success"
            })
        }

    })

}
