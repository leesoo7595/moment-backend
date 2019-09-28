const AWS = require("aws-sdk");
const secret = require("../credentials/credentials.json");
const s3 = new AWS.S3({
    credentials: {
        accessKeyId: secret.aws.accessKeyId,
        secretAccessKey: secret.aws.secretAccessKey,
    }
});
let params = {Bucket: secret.aws.bucketName};


async function listAllBucketKeys() {
    s3.listObjectsV2(params, async (err, data) => {
        if (err) return err;
        data.Contents.forEach(e => {
            params = {
                Bucket: secret.aws.bucketName,
                Key: e.Key,
            };
            deleteAllKeys(params);
        });
    });
}

async function deleteAllKeys(params) {
    s3.deleteObject(params, (err, data) => {
        if (err) return err;
        console.log(params, "successfully deleted");
    });
}

listAllBucketKeys().then(() => console.log("success")).catch(console.error);