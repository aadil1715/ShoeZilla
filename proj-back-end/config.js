const config = {
    "region" : process.env.REGION.toString(),
    "tables":{
        "users" : "users",
        "products" : "products"
    },
    "buckets":{
        "productImages": "product-images-group-12"
    }
}

module.exports = config;
