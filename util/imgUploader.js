const {URL} = require("url");
const AWS = require("aws-sdk");
const uuid = require("uuid/v5");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const stream = require("stream");
const request = require("request");
const sharp = require("sharp");
const secret = require("../credentials/credentials.json");
const s3 = new AWS.S3({
    credentials: {
        accessKeyId: secret.aws.accessKeyId,
        secretAccessKey: secret.aws.secretAccessKey,
    }
});

const bucket = secret.aws.bucketName;
const fileName = "img";
const acl = "public-read";

const multerMiddleWare = multer({
    storage: multerS3({
        s3,
        bucket,
        acl,
        key: (req, file, cb) => {
            //todo console
            cb(null, Date.now().toString());
            console.log("img", req.files);
        },
        transform: (req, file, cb) => {
            cb(null, sharp().resize(100, 100).png());
        }
    })
}).array(fileName, 10);

function promisifyUploadWithStream(params) {
    const pipe = new stream.PassThrough();
    const promise = s3.upload({
        ...params,
        Body:pipe
    }).promise();

    return {
        promise,
        pipe
    }
}

async function ogImgUploadS3(imgPath) {
    const url = new URL(imgPath);
    console.log("imgPath", imgPath);
    const imgName = url.pathname.split("/").pop();
    const extVal = path.extname(imgName).split(".").pop();
    const {promise, pipe} = promisifyUploadWithStream({Bucket:bucket, ACL: acl, Key:uuid(path.basename(imgPath), uuid.URL), ContentType:`image/${extVal}`});
    const req = request.get(imgPath);
    req.pipe(pipe);
    return await promise;
}


module.exports = {
    s3Multer: multerMiddleWare,
    s3Uploader: ogImgUploadS3
};