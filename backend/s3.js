require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const accessKeyId= process.env.AWS_ACCESS_KEY_ID;
const secretAccesskey= process.env.AWS_SECRET_ACCESS_KEY;
const region =process.env.AWS_REGION;
const bucket_name =process.env.AWS_BUCKET_NAME;


const s3 = new S3({
    region,
    accessKeyId,
    secretAccesskey,
}) 

function uploadFile(file){    
    const filestream = fs.createReadStream(file.path);
    const params = {
        Bucket: bucket_name,
        Key: 'common/'+file.filename, // File name you want to save as in S3
        Body: filestream ,
        ContentEncoding: 'base64',
        ContentType: file.mimetype,
        ACL:'public-read'
    }

    return s3.upload(params).promise()
}


function uploadFileLoggedUser(file,id){  
    //console.log(file);  
    const filestream = fs.createReadStream(file.path);
    const params = {
        Bucket: bucket_name,
        Key: id+"/"+file.filename, // File name you want to save as in S3
        Body: filestream,
        ContentEncoding: 'base64',
        ContentType: file.mimetype,
        ACL:'public-read'
    }
    return s3.upload(params).promise()
}


function getFileStream(filekey){
    const downloadParams = {
        key:filekey,
        Bucket:bucket_name
    } 

    return s3.getObject(downloadParams.createReadStream)
}

exports.uploadFile = uploadFile;
exports.uploadFileLoggedUser = uploadFileLoggedUser;
exports.getFileStream = getFileStream;